import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { rewardUserService } from '../../../services/plinko/api/rewardUserServiceNew';

export const rewardUserController = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber } = req.body;
    if (!name || !phoneNumber) {
      return sendErrorResponse(res, 'INVALID_INPUT', req);
    }

    const rewardIndex = await rewardUserService({ name, phoneNumber });

    if (typeof rewardIndex === 'object' && 'error' in rewardIndex) {
      return sendErrorResponse(res, 'RESULT_TYPE', req, new Error(rewardIndex.error));
    }
    return sendSuccessResponse(res, 'USER_REWARD', rewardIndex);
  } catch (error) {
    return sendErrorResponse(res, 'RESULT_TYPE', req, new Error(String(error)));
  }
};
