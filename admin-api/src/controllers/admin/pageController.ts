//src/controllers/admin/pageController.ts
import { Request, Response } from "express";
import slug from "slug";
import { PageAttributesInterface } from "page";
import { sendErrorResponse, sendSuccessResponse } from "../../helpers/responseHelper";
import { createPage, deletePage, getPageDetail, getPageList, statusChange, updatePage } from "../../services/admin/pageService";
import { ResponseMessageKey } from "../../constants";

export const pageCreate = async (req: Request, res: Response) => {
	try {
		const { content, title, meta_title, meta_desc, meta_keywords, status } = req.body;
		const slugTitle = slug(title, '_');
		const pageData: PageAttributesInterface = { content, title, meta_title, meta_desc, meta_keywords, slug: slugTitle, status };
		const result = await createPage(pageData);
		if (typeof result === 'object' && 'error' in result) {
			return sendErrorResponse(res, result.error as ResponseMessageKey, req);
		}
		return sendSuccessResponse(res, 'PAGE_CREATED', result);
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const pageUpdate = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { content, title, meta_title, meta_desc, meta_keywords, status } = req.body;
		const slugTitle = slug(title, '_');
		const pageData: PageAttributesInterface = { content, title, meta_title, meta_desc, meta_keywords, slug: slugTitle, status };
		const response = await updatePage(+id, pageData);
		if (typeof response === 'object' && 'error' in response) {
			return sendErrorResponse(res, response.error as ResponseMessageKey, req);
		}
		return sendSuccessResponse(res, 'PAGE_UPDATED');
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const pageStatusUpdate = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		await statusChange(+id, status);
		return sendSuccessResponse(res, 'STATUS_UPDATED');
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const pageList = async (req: Request, res: Response) => {
    const { page = 1 , title : filter, limit = 10, sortBy = 'title', orderBy = 'ASC' } = req.body;
	try {
		const response = await getPageList(+page, limit, filter, sortBy, orderBy);
		return sendSuccessResponse(res, 'PAGE_LISTED', response);
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const pageDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const response = await getPageDetail(+id);
		return sendSuccessResponse(res, 'PAGE_DETAILS', response);
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const pageDelete = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await deletePage(+id);
		return sendSuccessResponse(res, 'PAGE_DELETED');
	} catch (error) {
		return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
	}
}

export const paginationPageList = async (req: Request, res: Response) => {
    const { page = 1 , search_group_name : filter, limit = 10, sortBy = 'admin_group_name', orderBy = 'ASC' } = req.body;
    try {
      const response = await getPageList(+page, limit, filter, sortBy, orderBy);
      return sendSuccessResponse(res, 'PAGE_LISTED', response);
    } catch (error) {
      return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
    }
}