//src/validators/adminGroup/createValidation.ts
import { body } from 'express-validator';

export const createValidation = [
  body('admin_group_name').notEmpty().withMessage('Content can not be empty!'),
];

export const updateValidation = [
  body('status').isBoolean().withMessage('Status is required!'),
];
