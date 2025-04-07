//src/helpers/responseHelper.ts
import { Request, Response } from 'express';
import { RESPONSES } from '../constants/responses';
import logger from '../logger';

interface ResponseData {
  status: boolean;
  message: string;
  data?: any;
}

// export const sendSuccessResponse = (res: Response, messageKey: string, data: any = null, statusCode: number = 200) => {
//   const message = RESPONSES.SUCCESS[messageKey as keyof typeof RESPONSES.SUCCESS] || messageKey;
//   const response: ResponseData = { status: true, message, data };

//   res.status(statusCode).json(response);
// };
export const sendSuccessResponse = (res: Response, messageKey: string, data: any = null, statusCode: number = 200) => {
  const message = RESPONSES.SUCCESS[messageKey as keyof typeof RESPONSES.SUCCESS] || messageKey;

  if (Array.isArray(data)) {
    // Parse `stripe_texts` and `images` for each item in the array
    data = data.map(item => ({
      ...item,
      stripe_texts: typeof item.stripe_texts === 'string' ? JSON.parse(item.stripe_texts) : item.stripe_texts,
      images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
    }));
  } else if (data && typeof data === 'object') {
    // Parse `stripe_texts` and `images` if `data` is an object
    if (data.stripe_texts && typeof data.stripe_texts === 'string') {
      data.stripe_texts = JSON.parse(data.stripe_texts);
    }
    if (data.images && typeof data.images === 'string') {
      data.images = JSON.parse(data.images);
    }
  }

  const response: ResponseData = { status: true, message, data };

  res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  messageKey: string,
  req?: Request,
  error?: Error,
  data: any = null,
  statusCode: number = 400,
) => {
  const message = RESPONSES.ERROR[messageKey as keyof typeof RESPONSES.ERROR] || messageKey;
  const response: ResponseData = { status: false, message, data };

  const requestId = req?.headers['x-request-id'] ?? 'N/A';
  const method = req?.method ?? 'N/A';
  const url = req?.url ?? 'N/A';
  const body = JSON.stringify(req?.body ?? {});
  const query = JSON.stringify(req?.query ?? {});
  const errorStack = error?.stack ?? 'N/A';
  const errorMessage = error?.message ?? 'N/A';

  const logMessage = `Request ID: ${requestId} - ${method} ${url} - ${body} - ${query}`;

  if (error) {
    logger.error(`${logMessage} - Message: ${errorMessage} - Stack Trace: ${errorStack}`);
  } else {
    logger.error(`${logMessage} - MessageKey: ${messageKey}`);
  }

  res.status(statusCode).json(response);
};
