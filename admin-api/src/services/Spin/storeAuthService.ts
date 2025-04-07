import jwt from 'jsonwebtoken';
import StoreManagement from '../../models/Spin/admin/Store';
import dotenv from 'dotenv';
import { SendOtp, verifyOtp } from './admin/customer';
import { sendErrorResponse, sendSuccessResponse } from '../../helpers/responseHelper';
dotenv.config();

//service to send the otp and create a new one
export const requestOtp = async (mobile_number: string, res: any) => {
  const store = await StoreManagement.findOne({ where: { mobile: mobile_number } });
  if (store && store.dataValues.status) {
    const otp = await SendOtp(mobile_number, res);
    return sendSuccessResponse({...res, otp: otp}, 'OTP_SENT'); // TEMP ADD OTP
  } else {
    return sendErrorResponse(res, 'STORE_NOT_FOUND');
  }
};

export const authenticateStore = async (mobile_number: string, otp: string) => {
  try {
    const store = await StoreManagement.findOne({ where: { mobile: mobile_number } });

    if (!store) {
      throw new Error('Invalid storename');
    }

    const isOtpValid = await verifyOtp(mobile_number, otp);

    if (!isOtpValid) {
      throw new Error('Invalid or expired OTP');
    }

    if (store.status !== true) {
      throw new Error('Login not allowed. This store is not marked as default.');
    }

    const secret = process.env.JWT_APP_SECRET;
    if (!secret) {
      throw new Error('Missing JWT_APP_SECRET in env.');
    }

    const token = jwt.sign({ storeId: store.id, mobile: mobile_number }, secret, {
      expiresIn: '1m',
    });

    return { token, store };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
