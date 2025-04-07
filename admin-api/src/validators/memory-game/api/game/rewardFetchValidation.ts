import { body } from 'express-validator';

export const rewardFetchValidation = [
  // Validate time_taken: must not be empty and must be greater than 0.
  body('time_taken')
    .notEmpty()
    .withMessage('Time taken can not be empty.')
    .custom(value => {
      if (value <= 0) {
        throw new Error('Time taken must be greater than 0.');
      }
      return true;
    }),

  // Validate moves_taken: must not be empty and must be a positive number.
  body('moves_taken')
    .notEmpty()
    .withMessage('Moves taken can not be empty.')
    .isInt({ min: 0 })
    .withMessage('Moves taken must be greater than or equal to 0.'),

  // Validate pairs_matched: must not be empty and must be a positive number.
  body('pairs_matched')
    .notEmpty()
    .withMessage('Pairs matched can not be empty.')
    .isInt({ min: 0 })
    .withMessage('Pairs matched must be greater than or equal to 0.'),

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
    .withMessage(
      'Mobile number must only contain digits (0-9) and must not start with 0.',
    ),
];
