import { Request, Response } from 'express';
import { getSpinData, updateSpinData } from '../../services/admin/spinService';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';

export const listSpin = async (req: Request, res: Response) => {
  try {
    const spins = await getSpinData();
    return sendSuccessResponse(res, 'SPIN_LISTED', spins);
  } catch (error: any) {
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};

export const updateAllSpinRecords = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data || data.length === 0) {
      return sendSuccessResponse(res, 'EMPTY');
    }

    const defaultValue = data.filter((item: any) => item.is_default === true);
    if (defaultValue.length > 1) {
      return sendErrorResponse(res, 'ONLY_ONE_DEFAULT_SPIN_ALLOWED');
    }

    if (defaultValue.length === 1) {
      const defaultSpin = defaultValue[0];

      if (!Array.isArray(defaultSpin.stripe_texts) || defaultSpin.stripe_texts.length === 0) {
        return sendErrorResponse(res, 'EMPTY_STRIPE_TEXTS');
      }

      const hasEmptyText = defaultSpin.stripe_texts.some(
        (textItem: any) => !textItem.text || textItem.text.trim() === ''
      );

      if (hasEmptyText) {
        return sendErrorResponse(res, 'INVALID_STRIPE_TEXTS');
      }
    }

    const updatedSpins = [];
    for (const record of data) {
      const { id } = record;

      if (!id) {
        return sendSuccessResponse(res, 'ID_EMPTY');
      }

      const updatedSpin = await updateSpinData(id, record);
      if (updatedSpin) {
        updatedSpins.push(updatedSpin);
      }
    }

    return sendSuccessResponse(res, 'SPINS_UPDATED');
  } catch (error: any) {
    console.error('Error updating spin records:', error);
    return sendErrorResponse(res, 'GENERIC', req, error instanceof Error ? error : undefined);
  }
};


