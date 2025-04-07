import { ValidationChain, body } from "express-validator";

export const verifyOtpValidation: ValidationChain[] = [
  body('user_name')
    .notEmpty()
    .withMessage('User name is required')
    .isString()
    .withMessage('User name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('User name must be between 2 and 50 characters')
    .matches(/^[^\d]/)
    .withMessage('User name cannot start with a number'),

  body('user_number')
    .notEmpty()
    .withMessage('User number is required')
    .isString()
    .withMessage('User number must be a string')
    .trim()
    .matches(/^[0-9+]+$/)
    .withMessage('User number must contain only numbers and + symbol')
    .isLength({ min: 10, max: 15 })
    .withMessage('User number must be between 10 and 15 characters'),
    
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isString()
    .withMessage('OTP must be a string')
    .trim()
    .isLength({ min: 4, max: 8 })
    .withMessage('OTP must be between 4 and 8 characters')
    .matches(/^[0-9]+$/)
    .withMessage('OTP must contain only numbers')
];