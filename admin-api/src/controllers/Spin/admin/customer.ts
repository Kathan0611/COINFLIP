import { Request, Response } from 'express';
import {
  SendOtp,
  verifyOtp,
  getcustomer,
  deletecustomer,
  exportCustomerLogs,
  isNumberBlocked,
  lastPlayed,
  deleteAllCustomer,
} from '../../../services/Spin/admin/customer';
import { sendSuccessResponse, sendErrorResponse } from '../../../helpers/responseHelper';
import { getTemplateData, selectedTemplateConfig } from '../../../services/Spin/admin/templateService';
import Customer from '../../../models/Spin/admin/customer';
import path from 'path';
import RewardsHistory from '../../../models/Spin/admin/rewardHistory';

//function to send otp and check the validations of a mobile number(whether it is blocked or played within 24hrs)
export const sendOtpHandler = async (req: Request, res: Response) => {
  try {
    const { mobile_number } = req.body;
    if (!mobile_number) {
      return sendErrorResponse(res, 'INVALID_REQUEST_SENT', req);
    }

    // const blocked = await isNumberBlocked(mobile_number as string);
    // if (blocked) {
    //   return sendErrorResponse(res, 'USER_BLOCKED', req);
    // }

    const lastPlayedCustomer = await lastPlayed(mobile_number);
    if (lastPlayedCustomer) {
      return sendErrorResponse(res, 'ALREADY_PLAYED', req);
    }

    await SendOtp(mobile_number as string, res);
    return sendSuccessResponse(res, 'OTP_SENT');
  } catch (error: any) {
    return sendErrorResponse(res, 'GENERIC_ERROR', req, error instanceof Error ? error : undefined);
  }
};

const getAvailablePrize = async (templateId: string, template: any) => {
  const rewardHistory = await RewardsHistory.findAll({
    where: { template_id: templateId },
  });

  const prizeLimit = Array.isArray(template.prize_limit) ? template.prize_limit : JSON.parse(template.prize_limit);

  let availablePrizes = prizeLimit.filter(prize => {
    const prizeCount = rewardHistory.filter(entry => Number(entry.prize) === Number(prize.id)).length;
    return prize.limit > 0 && Number(prize?.limit) > prizeCount;
  });

  // Fisher-Yates shuffle algorithm
  for (let i = availablePrizes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePrizes[i], availablePrizes[j]] = [availablePrizes[j], availablePrizes[i]];
  }
  return availablePrizes;
};

const allocatePrize = async (
  req: Request,
  res: Response,
  prizes: any,
  matchingTemplate: any,
  selectedTemplate: any,
) => {
  const { mobile_number, name } = req.body;
  const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

  const stripeTexts =
    typeof selectedTemplate?.stripe_texts === 'string'
      ? JSON.parse(selectedTemplate?.stripe_texts)
      : selectedTemplate?.stripe_texts;

  const selectedStripeTexts: any = stripeTexts?.find(st => Number(st.id) === Number(randomPrize.id));

  if (!selectedStripeTexts) {
    return sendErrorResponse(res, 'PRIZE_NOT_FOUND', req, new Error('Selected prize does not exist.'));
  }

  const customer = await Customer.create({
    mobile_number,
    name,
    prize: selectedStripeTexts.text,
  });

  await RewardsHistory.create({
    customer_id: String(customer.id),
    template_id: selectedTemplate.template_id,
    slice_count: Number(matchingTemplate.dataValues.slice_count),
    prize: randomPrize.id,
  });

  return sendSuccessResponse(res, 'OTP_VERIFIED', {
    customer_id: customer.id,
    mobile_number: customer.mobile_number,
    name: customer.name,
    prize: selectedStripeTexts,
  });
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const { mobile_number, otp, name } = req.body;

    if (!mobile_number || !otp || !name) {
      return sendErrorResponse(res, 'INVALID_REQUEST', req, new Error('Mobile number, OTP, and Name are required.'));
    }

    await verifyOtp(mobile_number, otp);

    const templates = await getTemplateData();
    let selectedTemplate = await selectedTemplateConfig();
    if (!selectedTemplate) {
      return sendErrorResponse(res, 'TEMPLATE_NOT_FOUND', req, new Error('No active template found.'));
    }

    const matchingTemplate = templates.find(t => t.id === selectedTemplate.template_id);
    if (!matchingTemplate) {
      return sendErrorResponse(res, 'MATCHING_TEMPLATE_NOT_FOUND', req, new Error('Matching template not found.'));
    }

    let prizes = await getAvailablePrize(selectedTemplate.template_id, matchingTemplate);

    if (!prizes || prizes.length === 0) {
      // Fix the destroy call
      await RewardsHistory.destroy({
        where: { template_id: selectedTemplate.template_id },
        force: true,
      });

      // Retry fetching available prizes
      prizes = await getAvailablePrize(selectedTemplate.template_id, matchingTemplate);
      return allocatePrize(req, res, prizes, matchingTemplate, selectedTemplate);
    }

    return allocatePrize(req, res, prizes, matchingTemplate, selectedTemplate);
  } catch (error: any) {
    if (error.message === 'Invalid or expired OTP') {
      return sendErrorResponse(res, 'INVALID_OTP', req, new Error('OTP is invalid or has expired.'));
    }
    return sendErrorResponse(res, 'GENERIC_ERROR', req, error instanceof Error ? error : undefined);
  }
};

// function to get a customer logs
export const getCustomerList = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      mobile_number = '',
      store_id,
      sort_field = 'id',
      sort_dir = 'ASC',
      start_date,
      end_date,
    } = req.body;

    const getCustomer = await getcustomer(
      Number(page),
      Number(limit),
      String(mobile_number),
      String(sort_field),
      sort_dir as 'ASC' | 'DESC',
      start_date,
      end_date,
    );

    if (!getCustomer || getCustomer.customers.length === 0) {
      return sendSuccessResponse(res, 'CUSTOMER_LIST', {
        customers: [],
        pagination: getCustomer.pagination,
      });
    }

    const storeIds = Array.from(new Set(getCustomer.customers.map(customer => customer.store_id))).filter(Boolean);

    let storeMap: Record<string, string> = {};

    const customersWithStoreName = getCustomer.customers.map(customer => ({
      ...customer.toJSON(),
    }));

    return sendSuccessResponse(res, 'CUSTOMER_LIST', {
      customers: customersWithStoreName,
      pagination: getCustomer.pagination,
    });
  } catch (error) {
    console.error('Error in getCustomerList:', error);
    return sendErrorResponse(res, 'GENERIC_ERROR', req, error instanceof Error ? error : undefined);
  }
};

// function to delete a customer
export const deleteCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'INVALID_ID', req);
    }
    const result = await deletecustomer(id);
    return sendSuccessResponse(res, 'CUSTOMER_DELETED');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC_ERROR', req);
  }
};

// function to export customer logs
export const customerLogs = async (req: Request, res: Response) => {
  try {
    const { end_date, mobile_number, store_id, start_date } = req.body;

    const filePath = await exportCustomerLogs(
      end_date ? String(end_date) : null,
      mobile_number ? String(mobile_number) : null,
      store_id ? Number(store_id) : null,
      start_date ? String(start_date) : null,
    );

    if (!filePath) {
      return sendErrorResponse(res, 'NO_CUSTOMER_LOGS');
    }
    const filename = path.basename(filePath);
    return sendSuccessResponse(res, 'CUSTOMER_LOG_EXPORTED', { relativePath: `exports/${filename}` });
  } catch (error: any) {
    if (error.message === 'Error generating customer logs file') {
      return sendErrorResponse(res, 'ERROR_GENERATING_LOGS');
    }

    return sendErrorResponse(res, 'EXPORT_FAILED', req);
  }
};

// function to delete a customer
export const deleteAllCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!Array.isArray(id) || id.length === 0) {
      return sendErrorResponse(res, 'INVALID_ID_LENGTH', req);
    }
    const result = await deleteAllCustomer(id);
    return sendSuccessResponse(res, 'ALL_CUSTOMER_DELETED');
  } catch (error) {
    return sendErrorResponse(res, 'GENERIC_ERROR', req);
  }
};
