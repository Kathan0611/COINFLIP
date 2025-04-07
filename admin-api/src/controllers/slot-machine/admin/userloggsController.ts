import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';
import { STATUS_CODES } from '../../../constants/statusCodes';
import { fetchUserLoggs, removeUserLogg } from '../../../services/slot-machine/admin/userlogsService';
import { ResponseMessageKey } from '../../../constants';
import { deleteMultipleCustomer, exportUserLogs } from '../../../services/admin/userLogsService';
import SpinHistory from '../../../models/slot-machine/SpinHistory';
import path from 'path';

export const getUserLoggs = async (req: Request, res: Response) => {
  try {
    const result = await fetchUserLoggs(req.body);
    if (!result.status) {
      return sendErrorResponse(
        res,
        result.message as ResponseMessageKey,
        req,
        undefined,
        null,
        STATUS_CODES.BAD_REQUEST
      );
    }
    return sendSuccessResponse(res, result.message as ResponseMessageKey, result.data, STATUS_CODES.OK);
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : new Error(String(error)),
      null,
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteUserLoggs = async (req: Request, res: Response) => {
  try {
    const result = await removeUserLogg(Number(req.params.id));
    if (!result.status) {
      return sendErrorResponse(
        res,
        result.message as ResponseMessageKey,
        req,
        undefined,
        null,
        STATUS_CODES.NOT_FOUND
      );
    }
    return sendSuccessResponse(res, result.message as ResponseMessageKey, result.data, STATUS_CODES.OK);
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : new Error(String(error)),
      null,
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteMultipleUserLogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Split and parse the id string to an array
    if (!Array.isArray(id) || id.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID', req);
    }

    const result = await deleteMultipleCustomer(id, SpinHistory);

    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'USER_LOG_DELETED_SUCCESS');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


export const exportSlotController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, phoneNumber } = req.body

    // Build the filters object.
    // NOTE: The export service expects the phone filter under the key "mobileNumber".
    // The SpinHistory model uses the field "user_number", so if filtering by phone is required,
    // the export service may need a slight modification.
    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      mobileNumber: phoneNumber || null,
      storeId: null,
    }

    // Define the attributes to export.
    // These must match the fields in your SpinHistory model.
    const attributes = ['id', 'user_name', 'user_number', 'result', 'prize_name', 'createdAt']

    // Call the generic export service.
    const filePath = await exportUserLogs(SpinHistory, filters, attributes)

    if (!filePath) {
      return sendErrorResponse(res, 'NO_RECORDS_FOUND', req)
    }

    // Convert the absolute file path into a relative path like "exports/<filename>"
    const relativePath = path.join('exports', path.basename(filePath))

    return sendSuccessResponse(res, 'EXPORT_SUCCESS',{ filePath: relativePath })
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : undefined
    )
  }
}
