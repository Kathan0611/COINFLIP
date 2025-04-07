import StoreManagement from '../../../models/Spin/admin/Store';
import { Op } from 'sequelize';
import { StoreInterface } from 'stores';
import RewardsHistory from '../../../models/Spin/admin/rewardHistory';
import  TemplateConfigs  from '../../../models/Spin/admin/templateConfig';
import  Templates  from '../../../models/Spin/admin/template';

// Custom error class
class StoreNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StoreNotFoundError';
  }
}

export const createStore = async (
  store_name: string,
  store_owner: string,
  location: string,
  mobile: string,
  status: boolean,
  min_spend_amount: number,
) => {
  const existingMobile = await StoreManagement.findOne({ where: { mobile } });
  if (existingMobile) {
    throw new Error('Mobile number already exists.');
  }
  await StoreManagement.create({
    store_name,
    store_owner,
    location,
    mobile,
    status,
    min_spend_amount,
  });
};

export const getAllStores = async (
  page: number = 1,
  limit: number = 10,
  store_name: string = '',
  store_owner: string = '',
  sort_field: string = 'id',
  sort_dir: 'ASC' | 'DESC' = 'ASC',
) => {
  const offset = (page - 1) * limit;
  let query: Partial<StoreInterface> = {};
  if (store_owner !== '') {
    (query as any)[Op.or] = [{ store_owner: { [Op.like]: `%${store_owner}%` } }];
  }

  if (store_name !== '') {
    (query as any)[Op.or] = [{ store_name: { [Op.like]: `%${store_name}%` } }];
  }

  const { count, rows } = await StoreManagement.findAndCountAll({
    where: query,
    attributes: ['id', 'store_name', 'store_owner', 'location', 'mobile', 'status', 'min_spend_amount'],
    limit,
    offset,
    order: [[sort_field, sort_dir?.toUpperCase()]],
    include: [
      {
        model: TemplateConfigs,
        as: 'template',
        attributes: ['template_id'],
        required: false,
        where: {
          is_default: 1,
        },
        include: [
          {
            model: Templates,
            as: 'allTemplates',
            attributes: ['slice_name'],
            required: false,
          },
        ],
      },
    ],
  });

  // Print the slice_name based on the template_id
  rows.forEach(store => {
    const templateId = (store as any).template?.template_id;
    const sliceName = (store as any).template?.allTemplates?.slice_name;
  });

  return {
    stores: rows,
    pagination: {
      current_page: page,
      per_page: limit,
      total: count,
      last_page: Math.ceil(count / limit),
    },
  };
};

export const findStoreByPK = async (id: number) => {
  const store = await StoreManagement.findByPk(id, {
    attributes: ['id', 'store_name', 'store_owner', 'location', 'mobile', 'status', 'min_spend_amount'],
  });
  return store;
};

export const editStoreById = async (
  id: number,
  updatedData: {
    store_name?: string;
    store_owner?: string;
    location?: string;
    mobile?: string;
    status?: boolean;
    password?: string;
    min_spend_amount?: number;
  },
) => {
  const store = await StoreManagement.findByPk(id);
  if (!store) {
    throw new Error('Store not found.');
  }

  const { mobile } = updatedData;

  if (mobile) {
    const mobileNumber = await StoreManagement.findOne({
      where: { mobile, id: { [Op.ne]: id } },
    });
    if (mobileNumber) {
      throw new Error('Mobile number already exists.');
    }
  }

  await store.update(updatedData);
  return store;
};

export const updateStoreStatusById = async (id: number, status: boolean) => {
  const store = await StoreManagement.findByPk(id);

  if (!store) {
    throw new StoreNotFoundError('Store not found.');
  }

  await store.update({ status });
  return { id: store.id, status: store.status };
};

export const deleteStore = async (id: number) => {
  const store = await findStoreByPK(id);
  if (store) {
    await store.destroy();
    return { message: `Store deleted successfully.` };
  }
  throw new StoreNotFoundError('Store not found or inactive.');
};

export const deleteAllStore = async (id: number[]) => {
  const deleteAllStores = await StoreManagement.destroy({ where: { id } });
  return deleteAllStores;
};

export const deleteRewards = async (storeIds: string[]) => {
  const deleteRewards = await RewardsHistory.destroy({
    force: true,
  });
  return deleteRewards;
};
