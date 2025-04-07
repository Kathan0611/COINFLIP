import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createValidation = [
  // Validate that total_prize_limit exists and is a number.
  body('total_prize_limit')
    .exists().withMessage('Total prize limit is required')
    .bail()
    .isNumeric().withMessage('Total prize limit must be a number'),

  // Validate that stripe_texts exists and its prize_limit values sum to total_prize_limit.
  body('stripe_texts')
    .exists().withMessage('Stripe texts are required')
    .bail()
    .custom((value, { req }) => {
      let stripeTexts: any[] = [];
      // If the value is a string, attempt to parse it.
      if (typeof value === 'string') {
        try {
          stripeTexts = JSON.parse(value);
        } catch (error) {
          throw new Error('Invalid JSON format for stripe_texts');
        }
      } else if (Array.isArray(value)) {
        stripeTexts = value;
      } else {
        throw new Error('stripe_texts must be an array or a valid JSON string');
      }

      // Calculate the sum of prize_limit values.
      const totalFromStripe = stripeTexts.reduce((sum, item) => {
        const prizeLimit = Number(item.prize_limit);
        if (isNaN(prizeLimit)) {
          throw new Error('Each stripe_texts item must have a valid prize_limit');
        }
        return sum + prizeLimit;
      }, 0);

      // Check if the sum matches total_prize_limit.
      if (Number(req.body.total_prize_limit) !== totalFromStripe) {
        throw new Error('Total prize limit must equal the sum of prize limits of all specific combinations');
      }
      return true;
    }),

  // Custom error handler: return error response in the desired format.
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return only the first error message in the custom response format.
      const errorMessage = errors.array()[0].msg;
      return res.status(422).json({ status: false, message: errorMessage, data: null });
    }
    next();
  }
];
