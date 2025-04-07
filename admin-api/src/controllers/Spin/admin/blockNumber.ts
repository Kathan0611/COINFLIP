import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';
import { blockNumber, getBlockedNumbers } from '../../../services/Spin/admin/blockNumber';

export const blockCustomer = async (req: Request, res: Response) => {
  try {
    const { mobile_numbers } = req.body;
    if (!mobile_numbers || typeof mobile_numbers !== 'string') {
      return sendErrorResponse(res, 'INVALID_MOBILE', req);
    }

    const numberArray = mobile_numbers
      .split(',')
      .map(number => number.trim())
      .filter(number => number);

    const isValid = numberArray.every(number => /^\d{10}$/.test(number));
    if (!isValid) {
      return sendErrorResponse(res, 'INVALID_MOBILE_NUMBER', req);
    }

    await blockNumber(numberArray);

    return sendSuccessResponse(res, 'CUSTOMER_BLOCKED');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const blockNumberList = async (req: Request, res: Response) => {
  try {
    const result = await getBlockedNumbers();
    return sendSuccessResponse(res, 'BLOCKED_NUMBER_LISTED', result);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
