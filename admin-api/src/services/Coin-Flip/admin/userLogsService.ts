import { Op } from 'sequelize';
import UserLogs from '../../../models/coin-flip/UserLogs';

//userLog Service
export const UserlogsList = async (
  pageNo: number,
  user_name?: string,
  mobile_number?: number,
  sort_dir?: string,
  sort_field?: string,
  id?: number,
) => {
  try {
    const limit = 10;
    const offset = (pageNo - 1) * limit;

    let whereClause: any = {};

    if (user_name) {
      whereClause.user_name = { [Op.like]: `%${user_name}%` };
    }

    if (mobile_number) {
      whereClause.mobile_number = { [Op.like]: `%${mobile_number}%` };
    }

    if (id) {
      whereClause.id = id;
    }

    // Handle sort field using if-else case
    let finalSortField: string;
    if (
      sort_field === 'user_name' ||
      sort_field === 'mobile_number' ||
      sort_field === 'createdAt' ||
      sort_field === 'updatedAt'
    ) {
      finalSortField = sort_field;
    } else {
      finalSortField = 'createdAt';
    }

    let finalSortDir: 'ASC' | 'DESC';

    if (sort_dir === 'ASC' || sort_dir === 'DESC') {
      finalSortDir = sort_dir as 'ASC' | 'DESC';
    } else {
      finalSortDir = 'DESC';
    }

    const order: [[string, 'ASC' | 'DESC']] = [[finalSortField, finalSortDir]];

    const result = await UserLogs.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });

    return {
      data: result.rows,
      totalRecords: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: pageNo,
    };
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw new Error('GENERIC_ERROR');
  }
};

//deleteLogs Service
export const deletelogs = async (id: number) => {
  const userFound = await UserLogs.findByPk(id);

  if (!userFound) return { error: 'USER_LOG_NOT_FOUND' };

  const delmessage = await UserLogs.destroy({ where: { id } });

  if (delmessage) {
    return { success: 'USER_LOG_DELETE_SUCCESS' };
  } else {
    return { error: 'USER_LOG_DELETE_FAILED' };
  }
};
