import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../../constants';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { userLogsList, deleteLog } from '../../../services/memory-game/admin/userLogsService';
import { deleteMultipleCustomer, exportUserLogs } from '../../../services/admin/userLogsService';
import UserLogs from '../../../models/memory-game/UserLogsModel';
import path from 'path';

export const listingUserLogs = async (req: Request, res: Response) => {
  try {
    const pageNo = parseInt(req.body.page_no) || 1;
    const { name, mobile, sort_dir, sort_field } = req.body;

    const result = await userLogsList(pageNo, name, mobile, sort_dir, sort_field);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'USER_LOGS_FETCHED_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const deleteUserLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteLog(parseInt(id, 10));
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'USER_LOG_DELETED_SUCCESS', { isDeleted: result });
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

export const exportMemoryGameUserLogsController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, mobileNumber } = req.body

    // Build the filters object.
    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      mobileNumber: mobileNumber || null,
      storeId: null,
    }

    // Define the list of attributes to export.
    const attributes = ['id', 'name', 'mobile', 'score', 'reward', 'createdAt']

    // Call the generic export service.
    const filePath = await exportUserLogs(UserLogs, filters, attributes)

    if (!filePath) {
      return sendErrorResponse(res, 'NO_RECORDS_FOUND', req)
    }

    // Create a relative file path: "exports/<filename>"
    const relativePath = path.join('exports', path.basename(filePath))

    return sendSuccessResponse(res, 'EXPORT_SUCCESS', { filePath: relativePath },)
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : undefined
    )
  }
}
