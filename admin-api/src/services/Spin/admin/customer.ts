import BlockCustomers from '../../../models/Spin/admin/blockCustomer';
import  Customer  from '../../../models/Spin/admin/customer';
import Otp from '../../../models/Spin/admin/otp';
import { sendSMS } from '../../../helpers/Spin/sendSms';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import Sequelize from 'sequelize';

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
export const isNumberBlocked = async (phone: string) => {
  const blockedNumbers = await BlockCustomers.findAll();

  for (const record of blockedNumbers) {
    if (record.mobile_number) {
      const numbers = record.mobile_number.split(',').map(num => num.trim());
      if (numbers.includes(phone)) {
        return true;
      }
    }
  }

  return false;
};

export const lastPlayed = (phone: any) =>
  Customer.findOne({
    where: { mobile_number: phone,createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });

//service to send the otp and create a new one
export const SendOtp = async (mobile_number: string, res: any) => {
  const otp = generateOtp();
  await Otp.destroy({ where: { mobile_number } });

  const newOtp = await Otp.create({
    mobile_number,
    otp: otp,
  } as any);

  await sendSMS(mobile_number, otp);
  return newOtp;
};

//service to verify the otp and delete it
export const verifyOtp = async (mobile_number: string, otp: string) => {
  const otpRecord = await Otp.findOne({
    where: { mobile_number, otp, createdAt: { [Op.gte]: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }

  await Otp.destroy({ where: { mobile_number } });
  return true;
};

export const getcustomer = async (
  page: number = 1,
  limit: number = 10,
  mobile_number: string = '',
  sort_field: string = 'id',
  sort_dir: 'ASC' | 'DESC' = 'ASC',
  start_date?: string,
  end_date?: string,
) => {
  const offset = (page - 1) * limit;
  let query: any = {};

  const allowedSortFields = ['id', 'mobile_number', 'prize', 'name', 'updatedAt', 'createdAt', 'store_id'];

  if (!allowedSortFields.includes(sort_field)) {
    sort_field = 'id';
  }

  if (mobile_number.trim()) {
    query.mobile_number = { [Op.like]: `%${mobile_number}%` };
  }


  if (start_date && end_date) {
    query.createdAt = {
      [Op.between]: [new Date(`${start_date}T00:00:00.000Z`), new Date(`${end_date}T23:59:59.999Z`)],
    };
  } else if (start_date) {
    query.createdAt = { [Op.gte]: new Date(`${start_date}T00:00:00.000Z`) };
  } else if (end_date) {
    query.createdAt = { [Op.lte]: new Date(`${end_date}T23:59:59.999Z`) };
  }

  const orderClause: any[] = [[sort_field, sort_dir]];

  const { count, rows } = await Customer.findAndCountAll({
    where: query,
    limit,
    offset,
    order: orderClause,
    attributes: ['id', 'mobile_number', 'name', 'prize', 'createdAt', 'updatedAt'],
    logging: console.log,
  });

  return {
    customers: rows,
    pagination: {
      current_page: page,
      per_page: limit,
      total: count,
      last_page: Math.ceil(count / limit),
    },
  };
};

//service to delete a customer
export const deletecustomer = async (id: string) => {
  const deletedRecord = await Customer.destroy({ where: { id } });
  return deletedRecord;
};

//service to export the customer logs as an excel file
export const exportCustomerLogs = async (
  endDate: string | null,
  mobileNumber: string | null,
  storeId: number | null,
  startDate: string | null,
): Promise<string | null> => {
  try {
    const whereConditions: any = {};

    if (storeId) {
      whereConditions['store_id'] = storeId;
    }

    if (mobileNumber) {
      whereConditions['mobile_number'] = { [Op.like]: `%${mobileNumber}%` };
    }

    if (startDate && endDate) {
      whereConditions['updatedAt'] = {
        [Op.between]: [
          new Date(`${startDate}T00:00:00.000Z`), // Start of the day
          new Date(`${endDate}T23:59:59.999Z`), // End of the day
        ],
      };
    }

    const customers = await Customer.findAll({
      attributes: ['id', 'name', 'mobile_number', 'prize', 'updatedAt'],
      where: whereConditions,
    });

    if (!customers.length) return null;

    const customerData = customers.map(customer => {
      return {
        'Customer name': customer?.name || '-',
        'Mobile number': customer?.mobile_number || '-',
        Prize: customer.prize,
        PlayedAt: customer.updatedAt ? customer.updatedAt.toLocaleString() : '-',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(customerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Logs');

    const exportDir = path.join(process.cwd(), '/src/assets/uploads/exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, `customer_logs_${Date.now()}.xlsx`);

    try {
      XLSX.writeFile(workbook, filePath);
    } catch (err) {
      throw new Error('Error generating customer logs file');
    }

    console.log('Exported vasu customer logs to:', filePath);
    return filePath;
  } catch (err) {
    throw new Error('Error generating customer logs file');
  }
};

export const deleteAllCustomer = async (id: string[]) => {
  const deletedRecord = await Customer.destroy({ where: { id } });
  return deletedRecord;
};
