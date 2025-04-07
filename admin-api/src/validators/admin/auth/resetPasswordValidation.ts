import { body } from 'express-validator';

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').notEmpty().withMessage('New Password is required'),
];
