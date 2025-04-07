import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../../constants';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { createOrUpdateConfig, getMemoryGameConfig } from '../../../services/memory-game/admin/memoryGameService';

export const setGameConfig = async (req: Request, res: Response) => {
  try {
    const result = await createOrUpdateConfig(req.body, req.files);
    return sendSuccessResponse(res, 'GAME_CONFIG_SET_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const getGameConfig = async (req: Request, res: Response) => {
  try {
    const result = await getMemoryGameConfig();
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'GAME_CONFIG_FETCHED_SUCCESS', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
