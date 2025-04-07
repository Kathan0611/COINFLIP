import express from 'express';
import { flipCoinHandler, gameconfigHandler, otpVerification } from '../../../../controllers/coin-flip/api/flipHandler';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { gameValidation } from '../../../../validators/coin-flip/api/gameValidation';
import { userAuthValidation } from '../../../../validators/coin-flip/api/userValidation';


const router = express.Router();

//@Post router for flip handler
router.post('/send-otp', gameValidation, validateRequest, flipCoinHandler);

router.post('/verify-otp', userAuthValidation, validateRequest, otpVerification);
//@get router for game configuration handler
router.get('/config', gameconfigHandler);

export default router;
