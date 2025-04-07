import { Request, Response } from 'express';
import { ResponseMessageKey } from '../../../constants/responses';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { gameUserList } from '../../../services/plinko/admin/gameUserListingService';

export const listingGameUserLogs = async (req: Request, res: Response) => {
  try {
    const pageNo = parseInt(req.body.page_no) || 1;
    const { name, phoneNumber, sort_dir, sort_field } = req.body;
    const result = await gameUserList(pageNo, name, phoneNumber, sort_dir, sort_field);
    if (typeof result === 'object' && 'error' in result) {
      return sendErrorResponse(res, result.error as ResponseMessageKey, req);
    }
    return sendSuccessResponse(res, 'ADMIN_LIST_FETCHED_SUCCESS', result);
  } catch (error) {
    console.log(error, 'error');

    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};
