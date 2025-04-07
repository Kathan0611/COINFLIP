import { Op } from 'sequelize';
import PlinkoGameUser from '../../../models/plinko/GameUserModel';
import { PlinkoGameUserInterface } from 'game-user';
import { Sequelize } from 'sequelize';

export const getGameUserDetails = async (phoneNumber: string) => {
  const gameUser = await PlinkoGameUser.findOne({
    where: {
      phoneNumber,
      deletedat: null, // Ensure deletedat is null
    },
  });
  console.log('gameUser', gameUser);
  if (!gameUser) return { error: 'USER_NOT_FOUND' };

  return {
    name: gameUser.name,
    phoneNumber: gameUser.phoneNumber,
    reward: gameUser.reward,
    createdat: gameUser.createdat,
    updatedat: gameUser.updatedat,
  };
};

const getQueryAndSortFields = (name: string, phoneNumber: string, sort_dir: string, sort_field: string) => {
  const search_name = name.trim();
  const search_phoneNumber = phoneNumber.trim();
  const sortOrder = sort_dir === 'desc' ? 'DESC' : ('ASC' as string);

  let query: Partial<PlinkoGameUserInterface> = {};
  if (search_name) query.name = { [Op.like]: `%${search_name}%` } as any;
  if (search_phoneNumber) query.phoneNumber = { [Op.like]: `%${search_phoneNumber}%` } as any;
  query.deletedat = null;
  let sortFields;
  let sortModel = 'PlinkoGameUser'; // Default sort model is 'Admin'

  switch (sort_field) {
    case 'name':
      sortFields = 'name';
      break;
    case 'phoneNumber':
      sortFields = 'phoneNumber';
      break;

    default:
      sortFields = 'createdat';
      break;
  }

  console.log('sortFields', sortFields, 'sortOrder', sortOrder, 'sortModel', sortModel, 'query', query);
  return { query, sortFields, sortOrder, sortModel };
};

export const gameUserList = async (
  pageNo: number,
  name: string,
  phoneNumber: string,
  sort_dir: string,
  sort_field: string,
) => {
  const limit = 10;
  const { query, sortFields, sortOrder, sortModel } = getQueryAndSortFields(name, phoneNumber, sort_dir, sort_field);
  let totalCount = 0;
  // let whereClause = {};
  query.deletedat = null;

  let { count, rows } = await PlinkoGameUser.findAndCountAll({
    attributes: ['id', 'name', 'phoneNumber', 'reward', 'createdat', 'updatedat'],
    where: query,
    order: [
      sortModel === 'PlinkoGameUser'
        ? [sortFields, sortOrder]
        : [{ model: PlinkoGameUser, as: '' }, sortFields, sortOrder],
    ],
    // order: [[sortFields, sortOrder]],
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
    // console.log("results", results);
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
    // console.log("results", results);
    return results;
  }
};
