import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';
import {
  createStore,
  getAllStores,
  findStoreByPK,
  editStoreById,
  updateStoreStatusById,
  deleteStore,
  deleteAllStore,
  deleteRewards,
} from '../../services/admin/storeService';

export const createStoreHandler = async (req: Request, res: Response) => {
  try {
    const result = await createStore(
      req.body.store_name,
      req.body.store_owner,
      req.body.location,
      req.body.mobile,
      req.body.status,
      req.body.min_spend_amount,
    );

    return sendSuccessResponse(res, 'STORE_CREATED', result);
  } catch (error: any) {
    if (error.message === 'Mobile number already exists.') {
      return sendErrorResponse(res, 'MOBILE_NUMBER_EXISTS');
    }
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const getAllStoreList = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, store_name = '', store_owner = '', sort_field = 'id', sort_dir = 'ASC' } = req.body;

    const result = await getAllStores(
      Number(page),
      Number(limit),
      String(store_name),
      String(store_owner),
      String(sort_field),
      sort_dir as 'ASC' | 'DESC',
    );

    return sendSuccessResponse(res, 'STORE_LISTED', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const getStoreDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await findStoreByPK(+id);
    if (!result) {
      return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
    }
    return sendSuccessResponse(res, 'STORE_DETAILS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const updateStoreHandler = async (req: Request, res: Response) => {
  try {
    const response = await editStoreById(+req.params.id, req.body);
    return sendSuccessResponse(res, 'STORE_DETAILS_UPDATED');
  } catch (error: any) {
    if (error.message === 'Mobile number already exists.') {
      return sendErrorResponse(res, 'MOBILE_NUMBER_EXISTS');
    }
    return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
  }
};

export const updateStoreStatusHandler = async (req: Request, res: Response) => {
  try {
    const response = await updateStoreStatusById(+req.params.id, req.body.status);
    return sendSuccessResponse(res, 'STORE_STATUS_UPDATED');
  } catch (error) {
    return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
  }
};

export const deleteStoreHandler = async (req: Request, res: Response) => {
  try {
    const result = await deleteStore(+req.params.id);
    return sendSuccessResponse(res, 'STORE_DELETED');
  } catch (error) {
    return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
  }
};

export const deleteAllStoreHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const result = await deleteAllStore(id);
    if (!Array.isArray(id) || id.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID_LENGTH');
    }
    return sendSuccessResponse(res, 'ALL_STORE_DELETED');
  } catch (error) {
    return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
  }
};

export const deleteAllRewards = async (req: Request, res: Response) => {
  try {
    const { store_ids } = req.body;
    if (!store_ids) {
      return sendErrorResponse(res, 'STORE_NOT_FOUND', req);
    }
    if (!Array.isArray(store_ids) || store_ids.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID_LENGTH', req);
    }
    await deleteRewards(store_ids);
    return sendSuccessResponse(res, 'REWARDS_RESET');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC_ERROR', req);
  }
};
