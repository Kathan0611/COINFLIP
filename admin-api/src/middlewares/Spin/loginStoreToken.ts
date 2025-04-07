import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../../helpers/responseHelper';
import { Stores } from '../../models';

declare global {
  namespace Express {
    interface Request {
      storeId?: number;
    }
  }
}

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(res, 'TOKEN_REQUIRED', req, undefined, null, 403);
    }

    const token = authHeader.split(' ')[1];

    const decoded: any = jwt.verify(token, process.env.JWT_APP_SECRET as string);
    if (!decoded || !decoded.storeId) {
      return sendErrorResponse(res, 'INVALID_TOKEN', req, undefined, null, 403);
    }

    const store = await Stores.findOne({ where: { id: decoded.storeId } });
    if (!store || !store.dataValues.status) {
      return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 403);
    }

    req.storeId = decoded.storeId;
    next();
  } catch (error) {
    return sendErrorResponse(res, 'INVALID_TOKEN', req, undefined, null, 403);
  }
};
