// src/routes/api/slotRoutes.ts

import { Router } from 'express';
import { spinController, verifyOtpController } from '../../../../controllers/slot-machine/api/spinController';
import { spinValidation, verifyOtpValidation } from '../../../../validators/slot-machine/api/slot';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { getSlotImagesController } from '../../../../controllers/slot-machine/api/getSlotConfigController';
import { prizeInfoController } from '../../../../controllers/slot-machine/api/prizeInfoController';

const router = Router();

router.post('/send-otp', spinValidation, validateRequest, spinController);
router.post('/verify-otp', verifyOtpValidation, validateRequest, verifyOtpController);
router.get('/config', getSlotImagesController);
router.get('/info', validateRequest, prizeInfoController);

export default router;