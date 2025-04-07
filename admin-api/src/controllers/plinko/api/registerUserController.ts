import { Request, Response } from 'express';
import { registerGameUser } from '../../../services/plinko/api/playerService';
import { sendErrorResponse, sendSuccessResponse } from '../../../helpers/responseHelper';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { name,phoneNumber } = req.body;
        if (!name || !phoneNumber) {
            return sendErrorResponse(res, "INVALID_INPUT", req);
        }

        const result = await registerGameUser({ name, phoneNumber });

        // if('eligible' in result){
        //     return sendErrorResponse(res, "NOT_ELIGIBLE", req);
       
        // }

        if ('error' in result) {
            console.log("result:",result);
            return sendErrorResponse(res, "RESULT_TYPE", req, new Error(result.error));
        }
        return sendSuccessResponse(res, "GAME_USER_REGISTERED", result);
    } catch (error) {

    };
};