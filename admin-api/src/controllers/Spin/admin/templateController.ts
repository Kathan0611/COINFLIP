import { Request, Response } from 'express';
import {
  getTemplateData,
  updateOrCreateTemplateConfig,
  getTemplateConfig,
  selectedTemplateConfig,
  getStoreName,
  updateOrCreateTemplate,
} from '../../../services/Spin/admin/templateService';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';

export const getTemplates = async (req: Request, res: Response) => {
  try {

    const templates = await getTemplateData();
    const selectedTemplate = await selectedTemplateConfig();
    const updatedTemplates = templates.map(item => ({
      ...item?.dataValues,
      images:
        typeof item?.dataValues?.images === 'string' ? JSON.parse(item?.dataValues?.images) : item?.dataValues?.images,
      prize_limit:
        typeof item?.dataValues?.prize_limit === 'string'
          ? JSON.parse(item?.dataValues?.prize_limit)
          : item?.dataValues?.prize_limit,
      is_default: selectedTemplate?.template_id === item.id,
    }));
    return sendSuccessResponse(res, 'TEMPLATES_LISTED', {templates: updatedTemplates });
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const {templateid } = req.params;
    if (!templateid) {
      return sendErrorResponse(res, 'TEMPLATE_NOT_FOUND', req, new Error('Store ID and Template ID are required.'));
    }
    const templates = await getTemplateConfig(templateid);

    const parsedStripeTexts = Array.isArray(templates.stripe_texts)
      ? templates.stripe_texts
      : JSON.parse(templates.stripe_texts);
    const updatedTemplates = {
      ...templates,
      stripe_texts: parsedStripeTexts.map((stripe: any) => ({
        ...stripe,
        image: stripe.image || '',
      })),
    };
    return sendSuccessResponse(res, 'TEMPLATE_CONFIG', updatedTemplates.dataValues);
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const getSelectedTemplate = async (req: Request, res: Response) => {
  try {
    const selectedTemplate = await selectedTemplateConfig();
    if (!selectedTemplate) {
      return sendErrorResponse(res, 'SELECTED_TEMPLATE_NOT_FOUND', req, new Error('Selected Template not found'));
    }
    const templates = await getTemplateData();
    const updatedTemplates = templates.find(item => item.id === selectedTemplate.template_id);
    if (updatedTemplates) {
      const selectedTemplateObj = selectedTemplate.toJSON();
      Object.assign(selectedTemplateObj, {
        slice_name: updatedTemplates.slice_name,
        slice_count: updatedTemplates.slice_count,
        images: updatedTemplates.images,
      });
      return sendSuccessResponse(res, 'TEMPLATES_LISTED', selectedTemplateObj);
    }
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const updatedTemplates = async (req: Request, res: Response) => {
  try {
    const {templateid } = req.params;
    const { is_default, stripe_texts, total_prize_limit} = req.body;

    const parsedStripeTexts = Array.isArray(stripe_texts) ? stripe_texts : JSON.parse(stripe_texts);
    const parsedPrizeLimit = parsedStripeTexts?.map(item => {
      return {
        id: item?.id,
        limit: item.prize_limit
      }
    });

    const existingTemplate = await getTemplateConfig(templateid);
    const existingStripeTexts = Array.isArray(existingTemplate?.stripe_texts)
      ? existingTemplate.stripe_texts
      : JSON.parse(existingTemplate?.stripe_texts || '[]');

    const uploadedFiles = req.files as Express.Multer.File[];

    const imagesMap: { [key: string]: string } = {};
    uploadedFiles.forEach(file => {
      const originalFieldname = file.fieldname;
      const match = originalFieldname.match(/\[(\d+)\]\[image\]/);
      if (match) {
        const index = match[1];
        imagesMap[index] = `media/${file.filename}`;
      }
    });

    const updatedStripeTexts = parsedStripeTexts.map((textObj: any, index: number) => ({
      ...textObj,
      image: imagesMap[index] || textObj.image || existingStripeTexts[index]?.image,
    }));

    await updateOrCreateTemplateConfig(templateid, {
      is_default,
      total_prize_limit,
      stripe_texts: updatedStripeTexts,
    });

    await updateOrCreateTemplate(templateid, {prize_limit: parsedPrizeLimit});

    return sendSuccessResponse(res, 'TEMPLATE_CONFIG_UPDATED');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC', req);
  }
};
