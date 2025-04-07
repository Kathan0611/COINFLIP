import express from 'express';
import { sendOtpController, verifyOtpController } from '../../../../controllers/plinko/api/userOtpController';
import gameConfig from './gameConfig';

const router = express.Router();

router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.use('/config' , gameConfig);


export default router;
