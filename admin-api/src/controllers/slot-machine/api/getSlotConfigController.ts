import { Request, Response } from 'express';
import { getSlotImages } from '../../../services/slot-machine/api/getSlotService';
import { STATUS_CODES } from '../../../constants/statusCodes';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { ResponseMessageKey } from '../../../constants';

export const getSlotImagesController = async (req: Request, res: Response) => {
  try {
    const response = await getSlotImages();

    if (response.status) {
      return sendSuccessResponse(res, response.message as ResponseMessageKey, response.data, STATUS_CODES.OK);
    } else {
      return sendErrorResponse(res, response.message as ResponseMessageKey, req, undefined, { images: [] }, STATUS_CODES.NOT_FOUND);
    }
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC' as ResponseMessageKey, req, error instanceof Error ? error : new Error(String(error)), { images: [] }, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};
