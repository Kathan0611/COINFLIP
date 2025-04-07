import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { createOrUpdateCoinFlip, getCoinFlip } from '../../../services/Coin-Flip/admin/adminGameService';


//create or update controller
export const createOrUpdateCoinFlipHandler = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const head_image = files?.head_image?.[0]?.filename ?? null;
    const tail_image = files?.tail_image?.[0]?.filename ?? null;

    const { special_days, prices,daily_limit } = req.body;

    let parsedSpecialDays;
    let parsedPrices;
    let parsedDailyLimit;

    try {
      parsedSpecialDays = JSON.parse(special_days);
      parsedPrices = JSON.parse(prices);
      parsedDailyLimit=JSON.parse(daily_limit)
    
    } catch (error) {
      return sendErrorResponse(res, 'INVALID_JSON', req, error instanceof Error ? error : undefined);
    }
       

    // Create or update CoinFlip using the service
    const result = await createOrUpdateCoinFlip(head_image, tail_image, parsedSpecialDays, parsedPrices,parsedDailyLimit);

    if (result === null || 'error' in result) {
      return sendErrorResponse(res, result?.error || 'unknown error', req);
    }

    const action = result ? 'COINFLIP_UPDATED' : 'COINFLIP_CREATED';
    return sendSuccessResponse(res, action, result);
  } catch (error) {
    console.error('Error in createOrUpdateCoinFlipHandler:', error);
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

// Controller to get CoinFlip data
export const getCoinFlipHandler = async (req: Request, res: Response) => {
  try {
    const result = await getCoinFlip();

    if ('error' in result) {
      return sendErrorResponse(res, result.error, req, new Error(result?.error));
    }

    return sendSuccessResponse(res, 'COINFLIP_FETCHED', result);
  } catch (error) {
    console.error('Error in getCoinFlipHandler:', error);
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
