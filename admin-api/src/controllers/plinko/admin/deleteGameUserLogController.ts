import { Request, Response } from 'express';

import { deleteGameUserLog } from '../../../services/plinko/admin/getAllUserService';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { deleteMultipleCustomer } from '../../../services/admin/userLogsService';
import { ResponseMessageKey } from '../../../constants/responses';
import PlinkoGameUser from '../../../models/plinko/GameUserModel';

export const deleteGameUserLogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id); // Convert id to a number

    const result = await deleteGameUserLog(numericId);
    if (result?.error) {
      return sendErrorResponse(res, result.error, req); // Use sendErrorResponse to handle error response
      // return res.status(400).json({ error: result.error });
    }
    return sendSuccessResponse(res, 'GAME_USER_LOG_DELETED', result); // Use sendSuccessResponse to handle success response
    // return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 'GENERIC', req);
    // return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMultipleUserLogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Split and parse the id string to an array
    if (!Array.isArray(id) || id.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID', req);
    }

    const result = await deleteMultipleCustomer(id, PlinkoGameUser);

    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, 'USER_LOG_DELETED_SUCCESS');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};