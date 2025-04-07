import { Op } from 'sequelize';
import { UserLogsAttributes } from 'user-logs';
import UserLogs from '../../../models/memory-game/UserLogsModel';

const getQueryAndSortFields = (name: string, mobile: string, sort_dir: string, sort_field: string) => {
  const search_name = name.trim();
  const search_mobile = mobile.trim();
  const sortOrder = sort_dir === 'asc' ? 'ASC' : 'DESC';

  let query: Partial<UserLogsAttributes> = {};
  if (search_name) query.name = { [Op.like]: `%${search_name}%` } as any;
  if (search_mobile) query.mobile = { [Op.like]: `%${search_mobile}%` } as any;

  let sortFields;
  const sortModel = 'UserLogs';

  switch (sort_field) {
    case 'score':
      sortFields = 'score';
      break;
    case 'name':
      sortFields = 'name';
      break;
    default:
      sortFields = 'createdAt';
      break;
  }

  return { query, sortFields, sortOrder, sortModel };
};

export const userLogsList = async (
  pageNo: number,
  name: string,
  mobile: string,
  sort_dir: string,
  sort_field: string,
) => {
  const limit = 10;
  const { query, sortFields, sortOrder, sortModel } = getQueryAndSortFields(name, mobile, sort_dir, sort_field);
  let totalCount = 0;

  const { count, rows } = await UserLogs.findAndCountAll({
    attributes: ['id', 'name', 'mobile', 'score', 'reward', 'createdAt'],
    where: query,
    order: [[sortFields, sortOrder]],
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

export const deleteLog = async (id: number) => {
  const log = await UserLogs.destroy({ where: { id } });
  if (!log) return { error: 'USER_LOG_NOT_FOUND' };
  return true;
};
