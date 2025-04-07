import { body } from 'express-validator';
import { param } from 'express-validator';

export const getUserLoggsValidation = [
  body('page_no')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page_no must be a positive integer'),
  body('sort_dir')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sort_dir must be either asc or desc'),
  body('sort_field')
    .optional()
    .isIn(['name', 'createdAt'])
    .withMessage('sort_field must be either name or createdAt'),
  body('name')
    .optional()
    .isString()
    .withMessage('name must be a string'),
  body('mobile')
    .optional()
    .isString()
    .withMessage('mobile must be a string'),
];

export const deleteUserLoggsValidation = [
  param('id')
    .exists().withMessage('id is required')
    .isInt().withMessage('id must be an integer')
];

