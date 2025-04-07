import { Request, Response } from 'express';
import { getPrizeInfo } from '../../../services/slot-machine/api/prizeInfoService';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { STATUS_CODES } from '../../../constants';
import { ResponseMessageKey } from '../../../constants';

export const prizeInfoController = async (req: Request, res: Response) => {
  try {
    const response = await getPrizeInfo();

    if (response.status) {
      return sendSuccessResponse(res, response.message as ResponseMessageKey, response.data, STATUS_CODES.OK);
    } else {
      return sendErrorResponse(
        res,
        response.message as ResponseMessageKey,
        req,
        undefined,
        response.data,
        STATUS_CODES.BAD_REQUEST,
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC' as ResponseMessageKey,
      req,
      error instanceof Error ? error : new Error(String(error)),
      { info: [] },
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};
