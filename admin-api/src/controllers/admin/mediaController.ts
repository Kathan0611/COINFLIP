//src/controllers/admin/mediaController.ts
import { Request, Response } from "express";
import { create, getMediaList, mediaDelete } from "../../services/admin/mediaService";
import { sendErrorResponse, sendSuccessResponse } from "../../helpers/responseHelper";
import { ResponseMessageKey } from "../../constants";

export const getMedia = async (req: Request, res: Response) => {
	try {
		const mediaList = await getMediaList();
		return sendSuccessResponse(res, 'MEDIA_LISTED', mediaList);
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const deleteMedia = async (req: Request, res: Response) => {
	try {
		const response = await mediaDelete(+req.params.id);
		if (typeof response === 'object' && 'error' in response) {
			return sendErrorResponse(res, response.error as ResponseMessageKey, req);
		}
		return sendSuccessResponse(res, 'MEDIA_DELETED');
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}


export const createMedia = async (req: Request, res: Response) => {
	try {
		await create(req.files);
		return sendSuccessResponse(res, 'MEDIA_CREATED');
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}