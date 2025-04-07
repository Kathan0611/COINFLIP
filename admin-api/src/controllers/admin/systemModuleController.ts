//src/controllers/admin/systemModuleController.ts
import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../helpers/responseHelper";
import { getSystemModuleList } from "../../services/admin/systemModuleService";


export const systemModuleList = async (req: Request, res: Response) => {
	try {
		const result = await getSystemModuleList();
		return sendSuccessResponse(res, 'SYSTEM_MODULE_LISTED', result);
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}