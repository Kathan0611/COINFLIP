import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../helpers/responseHelper";
import { getGameConfig, setGameConfig } from "../../../services/plinko/admin/gameConfigService";

export const getGameConfigController = async (req: Request, res: Response) => {
  try {
    const result = await getGameConfig();
    if (result?.error) {
      return sendErrorResponse(res, result.error, req, new Error(result.error));
    }
    return sendSuccessResponse(res, "GAME_CONFIG_FETCHED", result);
  } catch (error) {
    return sendErrorResponse(res, "GET_", req, error instanceof Error ? error : undefined);
  }
};

export const setGameConfigController = async (req: Request, res: Response) => {
  try {
   
    const result = await setGameConfig(req.body);
    
    if (result?.error) {
      return sendErrorResponse(res, "RESULT_TYPE", req, new Error(result.error));
    }
    return sendSuccessResponse(res, "GAME_CONFIG_UPDATED", result);
  } catch (error) {
    return sendErrorResponse(res, "SET_GAME_CONFIG", req, error instanceof Error ? error : undefined);
  }
};
