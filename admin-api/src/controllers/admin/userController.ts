//src/controllers/admin/userController.ts
import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../helpers/responseHelper";
import { ResponseMessageKey } from "../../constants";
import { updateUser } from "../../services/admin/userService";

export const updateProfile = async (req: Request, res: Response) => {
	try {
	  const id  = req.userId;
	  if(!id) {
		return sendErrorResponse(res, 'GENERIC');
	  }
	  const { name, password } = req.body;
	  const result = await updateUser(+id, name, password);
	  if (typeof result === 'object' && 'error' in result) {
		return sendErrorResponse(res, result.error as ResponseMessageKey, req);
	  }
	  return sendSuccessResponse(res, 'USER_DETAIL_UPDATE_SUCCESS', null);
	} catch (error) {
	  return sendErrorResponse(res, 'GENERIC' , req, error instanceof Error ? error : undefined);
	}
  };