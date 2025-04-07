// src/validators/api/slot/spinValidation.ts

import { body, ValidationChain } from 'express-validator';

export const spinValidation: ValidationChain[] = [
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
    .isLength({ min: 10, max: 16 })
    .withMessage('User number must be between 10 and 16 characters'),
    
  body('isAuthenticated')
    .notEmpty()
    .withMessage('isAuthenticated flag is required')
    .isBoolean()
    .withMessage('isAuthenticated must be a boolean value')
];

