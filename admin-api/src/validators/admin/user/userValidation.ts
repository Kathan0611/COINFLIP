//src/validators/user/userValidation.ts
import { body } from 'express-validator';

export const updateProfileValidation = [
  body('name').notEmpty().withMessage('Name can not be empty!'),
];