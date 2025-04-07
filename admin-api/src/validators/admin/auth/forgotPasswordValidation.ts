import { body } from 'express-validator';

export const forgotPasswordValidation = [body('email').isEmail().withMessage('Valid email is required')];
