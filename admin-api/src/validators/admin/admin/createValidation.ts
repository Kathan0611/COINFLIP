//src/validators/admin/createValidation.ts
import { body } from 'express-validator';

export const createValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty.'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),

  body('admin_group_id')
    .notEmpty()
    .withMessage('Admin group id cannot be empty.')
    .isInt()
    .withMessage('Admin group id must be an integer.'),

  body('status').isBoolean().withMessage('Status must be a boolean value.'),
];
