//src/services/admin/adminService.ts
import { Admin, AdminGroup } from '../../models';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import commonConfig from '../../config/commonConfig';
import { emailConfig } from '../../helpers/emailHelper';
import { sequelize } from '../../config/database';
import { Op } from 'sequelize';
import { AdminAttributesInterface } from 'admin';

const generateSecurePassword = (length: number) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};

export const getAdminDetails = async (id: string) => {
  const admin = await Admin.findOne({
    where: { id },
    include: [{ model: AdminGroup, as: 'admin_group' }],
  });
  if (!admin) return { error: 'USER_NOT_FOUND' };
  if (!admin.status) return { error: 'USER_INACTIVE' };

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    admin_group: admin.admin_group?.admin_group_name ?? null,
    admin_group_id: admin.admin_group?.id ?? null,
    admin_permission: admin.admin_group?.permission ?? null,
  };
};

async function tofindAdminByEmailId(email: string) {
  return await Admin.findOne({
    where: { email: email },
  });
}

async function tofindAdminById(id: number) {
  return await Admin.findOne({
    attributes: ['id', 'admin_group_id', 'name', 'email', 'status'],
    where: { id: id },
  });
}

const getQueryAndSortFields = (name: string, email: string, sort_dir: string, sort_field: string) => {
  const search_name = name.trim();
  const search_email = email.trim();
  const sortOrder = sort_dir === 'desc' ? 'DESC' : 'ASC';

  let query: Partial<AdminAttributesInterface> = {};
  if (search_name) query.name = { [Op.like]: `%${search_name}%` } as any;
  if (search_email) query.email = { [Op.like]: `%${search_email}%` } as any;

  let sortFields;
  let sortModel = 'Admin'; // Default sort model is 'Admin'

  switch (sort_field) {
    case 'email':
      sortFields = 'email';
      break;
    case 'status':
      sortFields = 'status';
      break;
    case 'group_name': // Sorting by the 'name' field in the 'AdminGroup' model
      sortFields = 'admin_group_name';
      sortModel = 'AdminGroup';
      break;
    default:
      sortFields = 'name';
      break;
  }

  return { query, sortFields, sortOrder, sortModel };
};

export const adminUserList = async (
  pageNo: number,
  name: string,
  email: string,
  sort_dir: string,
  sort_field: string,
  admin_group_id: number,
) => {
  const limit = 10;
  const { query, sortFields, sortOrder, sortModel } = getQueryAndSortFields(name, email, sort_dir, sort_field);
  let totalCount = 0;
  let whereClause = {};

  if (admin_group_id) {
    let group_id = admin_group_id;
    whereClause = { id: group_id };
  }

  let { count, rows } = await Admin.findAndCountAll({
    attributes: ['id', 'name', 'email', 'status'],
    where: query,
    include: [{ where: whereClause, model: AdminGroup, as: 'admin_group', attributes: ['admin_group_name'] }],
    order: [
      sortModel === 'Admin'
        ? [sortFields, sortOrder]
        : [{ model: AdminGroup, as: 'admin_group' }, sortFields, sortOrder],
    ],
    offset: (pageNo - 1) * limit,
    limit: limit,
  });

  let results;
  if (count == 0) {
    results = {
      totalRecords: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page: pageNo,
      result: [],
    };
    return results;
  }

  if (count != 0) {
    totalCount = count;
    results = {
      result: rows,
      totalRecords: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page: pageNo,
    };
    return results;
  }
};

export const createAdmin = async (name: string, email: string, admin_group_id: number, status: boolean) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const emailFound = await tofindAdminByEmailId(email);
    if (emailFound) return { error: 'EMAIL_ALREADY_EXIST' };

    const password = generateSecurePassword(6);
    const password_generate = await bcrypt.hash(password, 16);
    const adminAdd = await Admin.create(
      {
        name: name,
        email: email,
        admin_group_id: admin_group_id,
        status: status,
        password: password_generate,
      },
      { transaction },
    );
    if (!adminAdd) return { error: 'ADMIN_FAILED_TO_CREATE' };

    const viewPath = './src/emails/admin/users';
    let emailTemplate = emailConfig(viewPath);
    const sendMail = await emailTemplate.send({
      template: 'create_users',
      message: {
        to: adminAdd.email,
      },
      locals: {
        logo_url: commonConfig.FRONT_URL + 'assets/logo-sm.png',
        name: adminAdd.name,
        email: adminAdd.email,
        password: password,
        login_url: commonConfig.FRONT_URL + 'admin/login',
        email_footer: commonConfig.EMAIL_FOOTER,
        status: true,
      },
    });

    if (sendMail) {
      await transaction.commit(); // Commit the transaction
      return true;
    } else {
      await transaction.rollback(); // Rollback the transaction
      return { error: 'EMAIL_SEND_FAILED' };
    }
  } catch (error: unknown) {
    await transaction.rollback(); // Rollback the transaction
    return { error: 'TRANSACTION_FAILED' };
  }
};

export const findAdmindetail = async (id: number) => {
  try {
    const userFound = await tofindAdminById(id);
    if (!userFound) return { error: 'ADMIN_USER_NOT_FOUND' };
    return userFound.toJSON();
  } catch (error: unknown) {
    return { error: 'GENERIC' };
  }
};

export const updateAdmin = async (
  id: number,
  name: string,
  email: string,
  admin_group_id: number,
  status: boolean,
  password: string,
) => {
  const userFound = await tofindAdminById(id);
  if (!userFound) return { error: 'ADMIN_USER_NOT_FOUND' };

  const { count: totalCount } = await Admin.findAndCountAll({
    where: {
      id: { [Op.not]: id },
      email,
    },
  });

  if (totalCount > 0) {
    return { error: 'EMAIL_ALREADY_EXIST' };
  }

  const requestParam = {
    name,
    email,
    admin_group_id,
    status,
    ...(password && password !== '' && { password: bcrypt.hashSync(password, 10) }),
  };

  const [updatemsg] = await Admin.update(requestParam, { where: { id } });
  if (!updatemsg) {
    return { error: 'ADMIN_USER_DETAIL_UPDATE_FAILED' };
  }
  return true;
};

export const updateStatus = async (id: number, status: boolean) => {
  const userFound = await tofindAdminById(id);
  if (!userFound) return { error: 'ADMIN_USER_NOT_FOUND' };

  const updatests = await Admin.update(
    {
      status: status,
    },
    { where: { id } },
  );

  if (updatests) {
    return { success: 'ADMIN_STATUS_CHANGE' };
  } else {
    return { error: 'ADMIN_STATUS_NOT_CHANGE' };
  }
};

export const deleteAdminUser = async (id: number) => {
  const userFound = await tofindAdminById(id);
  if (!userFound) return { error: 'ADMIN_USER_NOT_FOUND' };

  const delmessage = await Admin.destroy({ where: { id } });

  if (delmessage) {
    return { success: 'ADMIN_DELETE_SUCCESS' };
  } else {
    return { error: 'ADMIN_DELETE_FAILED' };
  }
};


export const findByAdminGrpId = async (id: number) => {
  return await Admin.findAll({where: {admin_group_id: id}});
}