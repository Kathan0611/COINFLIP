import { body } from 'express-validator';


//validator create  for coinflip game
export const gameValidation = [
  body('user_name').optional().isString().withMessage('user name must be required').trim().matches(/^[a-zA-Z ]+$/).withMessage('Username must contain only letters (a-z, A-Z)'),
  body('mobile_number').optional()
  .isString()
  .withMessage('mobile number must be required')
  .isLength({ min: 10, max: 10 })
  .withMessage('mobile number must have exactly 10 digits')
  .matches(/^[6-9][0-9]{9}$/)
  .withMessage('mobile number must be start with (6-9) and remain must be digit [0-9] only').trim(),
   body('prediction_value').optional().isString().withMessage('prediction_value must be required').trim(),
];
