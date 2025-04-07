import { RESPONSES } from '../../../constants';
import SpinHistory from '../../../models/slot-machine/SpinHistory';
import { Op } from 'sequelize';

interface ServiceResponse {
  status: boolean;
  message: string;
  data?: any;
}

const formatDate = (date: Date | undefined): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  // Using dashes (-) in date format to avoid auto-linking in Postman.
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const fetchUserLoggs = async (body: any): Promise<ServiceResponse> => {
  const { name, mobile, page_no, sort_dir, sort_field } = body;
  const page = page_no ? parseInt(page_no, 10) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Determine order field and direction.
  let orderField: string;
  const orderDirection: string = sort_dir ? sort_dir.toLowerCase() : 'desc';
  if (sort_field) {
    orderField = sort_field === 'name' ? 'user_name' : sort_field;
  } else {
    orderField = 'id';
  }

  // Build where clause with LIKE matching for name and mobile, if provided.
  let whereClause: any = {};

  if (name) {
    whereClause.user_name = { [Op.like]: `%${name}%` };
  }
  if (mobile) {
    whereClause.user_number = { [Op.like]: `%${mobile}%` };
  }

  const { count, rows } = await SpinHistory.findAndCountAll({
    where: whereClause,
    order: [[orderField, orderDirection]],
    limit,
    offset,
    paranoid: true, // This ensures only non-deleted records are returned
  });

  // If no matching records found, return an error response.
  if (count === 0) {
    return { status: true, message: RESPONSES.SUCCESS.USER_LOGGS_NOT_FOUND, data: null };
  }

  const totalRecords = count;
  const totalPage = Math.ceil(totalRecords / limit);

  const result = rows.map(entry => ({
    id: entry.id,
    name: entry.user_name,
    number: entry.user_number,
    result: entry.result,
    prize: entry.prize_name,
    createdAt: formatDate(entry.createdAt),
  }));

  return {
    status: true,
    message: RESPONSES.SUCCESS.USER_LOGGS_FETCHED,
    data: {
      result,
      totalRecords,
      totalPage,
      page,
    },
  };
};

export const removeUserLogg = async (id: number): Promise<ServiceResponse> => {
  // Find the record with findByPk to maintain compatibility
  const spinHistory = await SpinHistory.findByPk(id, { paranoid: true });

  if (!spinHistory) {
    return { status: false, message: RESPONSES.ERROR.USER_LOGGS_DELETE_FAIL };
  }

  await spinHistory.destroy();

  return { status: true, message: RESPONSES.SUCCESS.USER_LOGGS_DELETED, data: null };
};
