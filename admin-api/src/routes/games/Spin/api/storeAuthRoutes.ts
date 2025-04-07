import express from 'express';
import  {sendOtpController,verifyOtpController}  from '../../../../controllers/Spin/api/storeAuthController';
import { createValidation  } from '../../../../validators/admin/admin/createValidation';
import { validateRequest } from '../../../../middlewares/validateRequest';
const router = express.Router();

router.post('/send-otp', createValidation, validateRequest, sendOtpController);
router.post('/verify-otp', createValidation, validateRequest, verifyOtpController);

export default router;
