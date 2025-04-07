import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';
import { eligibleUserService } from '../../../services/plinko/api/eligibleUserService';

export const elibileUserController = async (req: Request, res: Response) => {
  try{  const {name,phoneNumber} = req.body;
    if(!name || !phoneNumber){
        return sendErrorResponse(res, "INVALID_INPUT", req);
    }
    const eligible = await eligibleUserService({name,phoneNumber});
    if(typeof eligible === 'object' && 'error' in eligible){
        return sendErrorResponse(res, "RESULT_TYPE", req, new Error(eligible.error));
    }
    return sendSuccessResponse(res, "GAME_USER_ELIGIBLE", eligible);
}catch(error){
    return sendErrorResponse(res, "RESULT_TYPE", req, new Error(String(error)));

}

 };