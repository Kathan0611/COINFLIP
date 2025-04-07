//src/controllers/admin/adminController.ts
import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../constants/responses';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';
import {
  adminUserList,
  createAdmin,
  findAdmindetail,
  getAdminDetails,
  updateAdmin,
  updateStatus,
  deleteAdminUser,
} from '../../services/admin/adminService';


export const listingAdmin = async (req: Request, res: Response) => {
  try {
    const pageNo = parseInt(req.body.page_no) || 1;
    const { name, email, sort_dir, sort_field, admin_group_id } = req.body;
    const result = await adminUserList(pageNo, name, email, sort_dir, sort_field, admin_group_id);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'ADMIN_LIST_FETCHED_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, email, admin_group_id, status } = req.body;
    const result = await createAdmin(name, email, admin_group_id, status);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'ADMIN_CREATED', null);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};

export const view = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await findAdmindetail(+id);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'ADMIN_USER_DETAIL_FETCHED_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, admin_group_id, status, password } = req.body;
    const result = await updateAdmin(+id, name, email, admin_group_id, status, password);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'ADMIN_USER_DETAIL_UPDATE_SUCCESS', null);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};

export const profile = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return sendErrorResponse(res, 'GENERIC', req);
  }
  try {
    const result = await getAdminDetails(userId);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'GET_PROFILE', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await updateStatus(+id, status);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, result.success, null);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteAdminUser(+id);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, result.success, null);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
  }
};
