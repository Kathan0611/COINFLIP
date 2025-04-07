// src/validators/admin/slot/createValidation.ts
import { body } from 'express-validator';

const validatePrizeWithLimit = (prize: any) => {
  if (!prize.name || typeof prize.name !== 'string') {
    throw new Error('Prize must have a name string');
  }
  if (prize.prize_limit === undefined || typeof prize.prize_limit !== 'number' || prize.prize_limit < 0) {
    throw new Error('Prize must have a non-negative limit number');
  }
};

export const createValidation = [
  body('slots').isInt({ min: 1 }).withMessage('Slots must be a positive integer'),
  body('section').isInt({ min: 1 }).withMessage('Section must be a positive integer'),
  body('user_daily_limit').isInt({ min: 1 }).withMessage('User daily limit must be a positive integer'),

  // Validate specific_combinations if provided
  body('specific_combinations')
    .optional()
    .custom(value => {
      if (!value) return true;
      const data = JSON.parse(value);
      if (!Array.isArray(data)) {
        throw new Error('Specific combinations must be an array');
      }
      data.forEach(combo => {
        if (!combo.combination || typeof combo.combination !== 'string') {
          throw new Error('Each specific combination must have a valid combination string');
        }
        if (combo.prize && !combo.prizes) {
          combo.prizes = [combo.prize];
        }
        if (!Array.isArray(combo.prizes)) {
          throw new Error('Prizes must be an array');
        }
        combo.prizes.forEach((prize: { name: any; prize_limit: number }) => {
          if (!prize.name || typeof prize.name !== 'string') {
            throw new Error('Prize must have a name string');
          }
        });
      });
      return true;
    }),

  // Validate new_user_prizes if provided
  body('new_user_prizes')
    .optional()
    .custom(value => {
      const data = JSON.parse(value);
      if (!Array.isArray(data)) {
        throw new Error('New user prizes must be an array');
      }
      data.forEach(validatePrizeWithLimit);
      return true;
    }),

  // New validation for total_prize_limit: it must equal the sum of prize limits from specific_combinations
  body('total_prize_limit').custom((value, { req }) => {
    let total = 0;
    if (req.body.specific_combinations) {
      try {
        const combos = JSON.parse(req.body.specific_combinations);
        if (Array.isArray(combos)) {
          combos.forEach(combo => {
            if (combo.prizes && Array.isArray(combo.prizes)) {
              combo.prizes.forEach((prize: { name: string; prize_limit: number }) => {
                total += Number(prize.prize_limit) || 0;
              });
            }
          });
        }
      } catch (err) {
        throw new Error('Invalid JSON in specific_combinations');
      }
    }
    if (Number(value) !== total) {
      throw new Error('Total prize limit must equal the sum of prize limits of all specific combinations');
    }
    return true;
  }),

  // Validate the file upload count and type only for files coming under the "images" key.
  body().custom((value, { req }) => {
    const sectionCount = parseInt(req.body.section, 10);
    const imagesFiles = req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['images'];
    if (!imagesFiles) {
      throw new Error('Section images are required');
    }
    if (imagesFiles.length !== sectionCount) {
      throw new Error('Number of uploaded images must match the number of sections');
    }
    // Validate each file for image type
    imagesFiles.forEach((file: Express.Multer.File) => {
      if (!file.mimetype.startsWith('image/')) {
      throw new Error('Only image files are allowed for section images');
      }
    });
    return true;
  }),
];
