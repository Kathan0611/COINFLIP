import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../../constants/responses';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { UserlogsList, deletelogs } from '../../../services/Coin-Flip/admin/userLogsService';
import { deleteMultipleCustomer, exportUserLogs } from '../../../services/admin/userLogsService';
import UserLogs from '../../../models/coin-flip/UserLogs';
import path from 'path';

// //listing Userlogs api
export const listingUserLogs = async (req: Request, res: Response) => {
  try {
    const pageNo: number = parseInt(req.body.page_no) || 1;
    const { user_name, mobile_number, sort_dir, sort_field, id } = req.body;

    const result = await UserlogsList(pageNo, user_name, mobile_number, sort_dir, sort_field, id);
    
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'USER_LISTING_FETCHED_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


//listing deleteUserLogs by id
export const deleteUserLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deletelogs(+id);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'USER_DELETE_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


export const deleteMultipleUserLogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Split and parse the id string to an array
    if (!Array.isArray(id) || id.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID', req);
    }

    const result = await deleteMultipleCustomer(id, UserLogs);

    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'USER_LOG_DELETED_SUCCESS');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


export const exportCoinFlipLogsController = async (req: Request, res: Response) => {
  try {
    // Extract filters from the request body.
    // Here we expect startDate, endDate, and mobileNumber.
    // Adjust as needed if you want additional filtering (e.g. by user_name).
    const { startDate, endDate, mobileNumber } = req.body

    // Build the filters object.
    // storeId is not applicable here, so we pass null.
    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      mobileNumber: mobileNumber || null,
      storeId: null,
    }

    // Define the attributes to export. These must match the fields in your UserLogs model.
    const attributes = [
      'id',
      'user_name',
      'mobile_number',
      'is_winner',
      'price',
      'createdAt',
    ]

    // Call the generic export service.
    const filePath = await exportUserLogs(UserLogs, filters, attributes)

    if (!filePath) {
      return sendErrorResponse(res, 'NO_RECORDS_FOUND', req)
    }

    // Convert the absolute file path into a relative one.
    // For example: "exports/game_logs_<timestamp>.xlsx"
    const relativePath = path.join('exports', path.basename(filePath))

    return sendSuccessResponse(res,'EXPORT_SUCCESS', { filePath: relativePath })
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : undefined
    )
  }
}
