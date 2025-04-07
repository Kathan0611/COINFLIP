import { Router } from 'express';
import { forgotPassword, resetPassword, signin } from '../../controllers/admin/authController';
import { validateRequest } from '../../middlewares/validateRequest';
import { forgotPasswordValidation, resetPasswordValidation, signinValidation } from '../../validators/admin/auth';

const router = Router();

router.post('/signin', signinValidation, validateRequest, signin);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword);

export default router;
