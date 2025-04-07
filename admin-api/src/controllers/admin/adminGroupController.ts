//src/controllers/admin/adminGroupController.ts
import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';
import { createGroup, findAdminGroup, getAdminGroups, updateGroup, deleteGroup, updateGroupStatus, paginationGrpList } from '../../services/admin/adminGroupService';
import { ResponseMessageKey } from '../../constants';

export const adminGroupList = async (req: Request, res: Response) => {
  try {
    const result = await getAdminGroups();
    return sendSuccessResponse(res, 'ADMIN_GROUP_LISTED', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const adminGroupDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await findAdminGroup(+id);
    if(!result) {
      return sendErrorResponse(res, 'ADMIN_GROUP_NOT_FOUND',req);
    }
    return sendSuccessResponse(res, 'ADMIN_GROUP_DETAILS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const deleteAdminGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteGroup(+id);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    } else if(!result) {
      return sendErrorResponse(res, 'ADMIN_GROUP_NOT_FOUND',req);
    }
    return sendSuccessResponse(res, 'ADMIN_GROUP_DELETED');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const create = async (req: Request, res: Response) => {
	const { admin_group_name, status, permissions } = req.body;
	try {
		const result = await createGroup(admin_group_name, status, permissions);
    return sendSuccessResponse(res, 'ADMIN_GROUP_CREATED', result);
	} catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
	const { admin_group_name, status, permissions } = req.body;
	try {
		const response = await updateGroup(+id, admin_group_name, status, permissions);
    if(!response[0]) {
      return sendErrorResponse(res, 'ADMIN_GROUP_NOT_FOUND', req);
    }
    return sendSuccessResponse(res, 'ADMIN_GROUP_UPDATED');
	} catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const statusUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
	const { status } = req.body;
	try {
		const response = await updateGroupStatus(+id, status);
    if(!response[0]) {
      return sendErrorResponse(res, 'ADMIN_GROUP_NOT_FOUND',req);
    }
    return sendSuccessResponse(res, 'ADMIN_GROUP_UPDATED');
	} catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const paginationList = async (req: Request, res: Response) => {
    const { page = 1 , search_group_name : filter, limit = 10, sortBy = 'admin_group_name', orderBy = 'ASC' } = req.body;
    try {
      const response = await paginationGrpList(+page, limit, filter, sortBy, orderBy);
      return sendSuccessResponse(res, 'ADMIN_GROUP_LISTED', response);
    } catch (error) {
      return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
    }
}
