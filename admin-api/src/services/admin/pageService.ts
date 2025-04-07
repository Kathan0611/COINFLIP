//src/services/admin/pageService.ts
import { Op } from "sequelize";
import { PageAttributesInterface } from "page";
import Page from "../../models/PageModel";

export const createPage = async (createPageData: PageAttributesInterface) => {
	const existingPage = await Page.findOne({
		where: {
			slug: createPageData.slug
		}
	});
	if (existingPage) {
		return { error: 'PAGE_ALREADY_EXISTS' };
	}
	return await Page.create(createPageData);
}

export const updatePage = async (id: number, createPageData: PageAttributesInterface) => {
	const existingPage = await Page.findOne({
		where: {
			slug: createPageData.slug,
			id: {
				[Op.ne]: id // `Op.ne` is used for "not equal"
			}
		}
	});
	if (existingPage) {
		return { error: 'PAGE_ALREADY_EXISTS' };
	}
	return await Page.update(createPageData, { where: { id } });
}

export const statusChange = async (id: number, status: boolean) => {
	return await Page.update({ status }, { where: { id } });
}

export const getPageList = async (page: number, limit: number, filter: string, sortBy: string, order: 'ASC' | 'DESC') => {
	try {
	  let query: Partial<PageAttributesInterface> = {};
	  if (filter) {
		query.title = { [Op.like]: `%${filter}%` } as any;
	  }
	  const result = await Page.findAndCountAll({
		where: query,
		offset: (page - 1) * limit,
		limit: limit,
		order: [[sortBy, order]]
	  });

	  return {
		"result": result.rows,
		"totalRecords": result.count,
		"totalPage": Math.ceil(result.count / limit),
		"page": page
	  }
	} catch (error) {
	  throw new Error('GENERIC');
	}
  }

export const getPageDetail = async (id: number) => {
	return await Page.findOne({ where: { id }});
}

export const deletePage = async (id: number) => {
	try {
		return await Page.destroy({ where: { id: id } });
	} catch (error) {
		throw new Error('GENERIC');
	}
}