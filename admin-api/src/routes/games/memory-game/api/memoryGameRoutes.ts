import { Router } from 'express';
import {
  checkUserEligibility,
  getMemoryGameConfig,
  getReward,
  otpVerification,
} from '../../../../controllers/memory-game/api/memoryGameController';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { rewardFetchValidation } from '../../../../validators/memory-game/api/game/rewardFetchValidation';
import { userAuthValidation } from '../../../../validators/memory-game/api/game/userAuthValidation';
import { userEligibilityValidation } from '../../../../validators/memory-game/api/game/userEligibilityValidation';

const router = Router();

router.get('/config', getMemoryGameConfig);
router.post('/reward', rewardFetchValidation, validateRequest, getReward);
router.post('/send-otp', userEligibilityValidation, validateRequest, checkUserEligibility);
router.post('/verify-otp', userAuthValidation, validateRequest, otpVerification);

export default router;
