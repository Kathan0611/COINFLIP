import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';

export const deleteMultipleCustomer = async (id: string[], model: any) => {
  const deletedRecord = await model.destroy({ where: { id } });
  if (!deletedRecord || deletedRecord === 0) {
    return { error: 'RECORDS_DELETION_FAILED' };
  }
  return deletedRecord;
};


export const exportUserLogs = async (
  model: any,
  filters: {
    startDate?: string | null;
    endDate?: string | null;
    mobileNumber?: string | null;
    storeId?: number | null;
  },
  attributes: string[],
): Promise<string | null> => {
  try {
    // Build the where condition based on the provided filters
    const whereConditions: any = {};

    if (filters.storeId) {
      whereConditions['store_id'] = filters.storeId;
    }

    if (filters.mobileNumber) {
      whereConditions['mobile_number'] = { [Op.like]: `%${filters.mobileNumber}%` };
    }

    if (filters.startDate && filters.endDate) {
      whereConditions['updatedAt'] = {
        [Op.between]: [
          new Date(`${filters.startDate}T00:00:00.000Z`), // start of the day
          new Date(`${filters.endDate}T23:59:59.999Z`), // end of the day
        ],
      };
    }

    // Query the records using the provided model
    const records = await model.findAll({
      attributes,
      where: whereConditions,
    });

    if (!records.length) return null;

    // Map the records into the export format using the attribute names as headers
    const exportData = records.map((record: any) => {
      const row: any = {};
      for (const attr of attributes) {
        // For date fields like updatedAt, format them into a readable string
        if (attr === 'updatedAt' && record[attr]) {
          row[attr] = record[attr].toLocaleString();
        } else {
          row[attr] = record[attr] || '-';
        }
      }
      return row;
    });

    // Create the Excel workbook and sheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Game Logs');

    // Ensure the export directory exists
    const exportDir = path.join(process.cwd(), '/src/assets/uploads/exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Generate a unique file name using a timestamp
    const filePath = path.join(exportDir, `game_logs_${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, filePath);

    return filePath;
  } catch (err) {
    throw new Error('Error generating logs file');
  }
};
