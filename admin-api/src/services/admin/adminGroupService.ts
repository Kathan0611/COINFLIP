//src/services/admin/adminGroupService.ts
import { Op } from "sequelize";
import { AdminGroupAttributes } from "admin-group";
import { AdminGroup } from '../../models';
import { findByAdminGrpId } from "./adminService";


export const getAdminGroups = async () => {
  try {
    return await AdminGroup.findAll({where: {status: 1},attributes:[['id', 'value'], ['admin_group_name','label']]});
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const findAdminGroup = async (id: number) => {
  try {
    return await AdminGroup.findByPk(id, { attributes: ['id', 'admin_group_name', 'status', 'permission'] });
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const deleteGroup = async (id: number) => {
  try {
    const admin = await findByAdminGrpId(id);
    if(admin.length > 0) {
      return { error: 'ADMIN_GROUP_HAS_USERS' };
    }
    return await AdminGroup.destroy({ where: { id } });
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const createGroup = async (admin_group_name: string, status: boolean, permissions: object) => {
  try {
    const adminGroup = {
      admin_group_name: admin_group_name,
      status: status,
      permission: JSON.stringify(permissions),
    };
    return await AdminGroup.create(adminGroup);
  } catch (error) {
    throw new Error('GENERIC');
  }
}

export const updateGroup = async (id: number, admin_group_name: string, status: boolean, permissions: object) => {
  try {
    const adminGroup = {
      admin_group_name: admin_group_name,
      status: status,
      permission: JSON.stringify(permissions),
    };
    return await AdminGroup.update(adminGroup, { where: { id } });
  } catch (error) {
    throw new Error('GENERIC');
  }
}

export const updateGroupStatus = async (id: number, status: boolean) => {
  try {
    return await AdminGroup.update({ status }, { where: { id } });
  } catch (error) {
    throw new Error('GENERIC');
  }
}

export const paginationGrpList = async (page: number, limit: number, filter: string, sortBy: string, order: 'ASC' | 'DESC') => {
  try {
    let query: Partial<AdminGroupAttributes> = {};
    if (filter) {
      query.admin_group_name = { [Op.like]: `%${filter}%` } as any;
    }
    const result = await AdminGroup.findAndCountAll({
      where: query,
      offset: (page - 1) * limit,
      limit: limit,
      order: [[sortBy, order]]
    });

    return {
      "result": result.rows,
      "totalRecords": result.count,
      "totalPage": Math.ceil(result.count / limit),
      "page": page
    }
  } catch (error) {
    throw new Error('GENERIC');
  }
}
