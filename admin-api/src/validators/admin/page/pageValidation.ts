//src/validators/page/pageValidation.ts
import { body } from 'express-validator';

export const createPageValidation = [
  body('content').notEmpty().withMessage('Content can not be empty!'),
  body('title').notEmpty().withMessage('Title can not be empty!'),
  body('status').isBoolean().withMessage('Status is required!'),
];

export const statusUpdateValidation = [
  body('status').isBoolean().withMessage('Status is required!')
]