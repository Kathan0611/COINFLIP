import { body, param } from 'express-validator';

export const updateValidation = [
  param('id').notEmpty().withMessage('ID is required.').isInt().withMessage('ID must be an integer.'),

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
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),

  body('confirm_password')
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password does not match password.');
      }
      return true;
    }),
];
