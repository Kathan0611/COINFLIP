import { body } from 'express-validator';

export const userAuthValidation = [
  // Validate name: must not be empty and must be a string.
  body('name')
    .notEmpty()
    .withMessage('Name can not be empty.')
    .trim()
    .toLowerCase()
    .isString()
    .withMessage('Name must be a string.')
    .matches(/^[a-zA-Z]{2,40}$/)
    .withMessage('Name must be between 2 and 40 characters long and can only contain letters.'),

  // Validate mobile: must not be empty and must be a string which only contains digits.
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number can not be empty.')
    .isString()
    .withMessage('Mobile number must be a string.')
    .matches(/^[1-9][0-9]{9}$/)
    .withMessage('Mobile number must only contain digits (0-9) and must not start with 0.'),

    // Validate otp: must not be empty and must be a string containing 6 digits.
  body('otp')
    .notEmpty()
    .withMessage('OTP can not be empty.')
    .isString()
    .withMessage('OTP must be a string.')
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('OTP must be 6 digits long.'),
];
