import { param } from 'express-validator';

export const deleteLogsValidation = [
  // Validate id: must be a valid positive integer.
  param('id').notEmpty().withMessage('ID is required.').isInt({ gt: 0 }).withMessage('ID must be a positive integer.'),
];
