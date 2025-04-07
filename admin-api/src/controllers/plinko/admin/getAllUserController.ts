import {getGameUsers}  from "../../../services/plinko/admin/getAllUserService";
import {Request,Response} from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../helpers/responseHelper";
import path from "path";
import PlinkoGameUser from "../../../models/plinko/GameUserModel";
import { exportUserLogs } from "../../../services/admin/userLogsService";

export const getAllUserController = async (req: Request, res: Response) => {

    try{
        const result = await getGameUsers();
        if(!Array.isArray(result) && result?.error){
            return sendErrorResponse(res, "RESULT_TYPE", req, new Error(result.error));
        }
        return sendSuccessResponse(res, "GAME_USERS_FETCHED", result);
    }catch(error){
        return sendErrorResponse(res, "GET_GAME_USERS", req, error instanceof Error ? error : undefined);
    }
};


export const exportPlinkoGameUserController = async (req: Request, res: Response) => {
  try {
    // Extract filter parameters from request body.
    // For this model, we expect startDate, endDate, and phoneNumber.
    const { startDate, endDate, phoneNumber } = req.body

    // Build filters.
    // Note: The generic export service expects a "mobileNumber" filter,
    // so we pass the phoneNumber value under that key.
    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      mobileNumber: phoneNumber || null,
      storeId: null,
    }

    // Define the list of attributes to export.
    // These attributes must match the field names defined in your PlinkoGameUser model.
    const attributes = ['id', 'name', 'phoneNumber', 'reward', 'createdat']

    // Call the generic export service.
    const filePath = await exportUserLogs(PlinkoGameUser, filters, attributes)

    if (!filePath) {
      return sendErrorResponse(res, 'NO_RECORDS_FOUND', req)
    }

    // Build the relative file path (e.g. "exports/game_logs_<timestamp>.xlsx").
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
