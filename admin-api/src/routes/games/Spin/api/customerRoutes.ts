import express from 'express';
import { sendOtpHandler, verifyOtpHandler } from '../../../../controllers/Spin/admin/customer';
import { createValidation } from '../../../../validators/Spin/admin';

const router = express.Router();

router.post('/sendotp', sendOtpHandler);
router.post('/verifyotp', verifyOtpHandler);

export default router;
