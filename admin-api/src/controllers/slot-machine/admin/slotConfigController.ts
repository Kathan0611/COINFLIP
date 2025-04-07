import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { ResponseMessageKey } from '../../../constants';
import { createSlotConfig, getSlotConfig } from '../../../services/slot-machine/admin/slotConfigService'
import { STATUS_CODES } from '../../../constants/statusCodes';

export const getConfig = async (req: Request, res: Response) => {
  try {
    const result = await getSlotConfig();

    if (!result.status) {
      return sendErrorResponse(res, result.message as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, result.message as ResponseMessageKey, result.data, STATUS_CODES.OK);
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : new Error(String(error)),
      null,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createConfig = async (req: Request, res: Response) => {
  try {
    // req.files is expected to be an object with keys "BackgroundImage" and "images"
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await createSlotConfig(req.body, files);

    if (!result.status) {
      return sendErrorResponse(res, result.message as ResponseMessageKey, req);
    }

    return sendSuccessResponse(res, result.message as ResponseMessageKey, result.data, STATUS_CODES.OK);
  } catch (error) {
    return sendErrorResponse(
      res,
      'GENERIC',
      req,
      error instanceof Error ? error : new Error(String(error)),
      null,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};
