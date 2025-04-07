import { body } from 'express-validator';

function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

//validator conflipcreatevalidation
export const coinFlipcreateValidation = [
  body('head_image').optional().isString().withMessage('Head image must be a string (URL or path).').trim(),

  body('tail_image').optional().isString().withMessage('Tail image must be a string (URL or path).').trim(),

  body('special_days')
    .optional()
    .custom(value => {
      console.log(value);
      // Validate each special day object in the array
      JSON.parse(value).forEach(
        (day: { start_date: string; end_date: string; daily_limit: string; price: string }, index: any) => {
          if (!day.start_date || !day.end_date) {
            throw new Error(`Special day at index ${index} must have start_date and end_date.`);
          }
          if (!isValidDate(day.start_date) || !isValidDate(day.end_date)) {
            throw new Error(`invalid start date format.`);
          }
          if (day.start_date > day.end_date) {
            throw new Error(`start_date after end_date.`);
          }
          if (typeof day.daily_limit !== 'string') {
            throw new Error(`daily_limit is required`);
          }
          if (typeof day.price !== 'string') {
            throw new Error(`prize is required`);
          }
          day.start_date = day.start_date.trim();
          day.end_date = day.end_date.trim();
          day.daily_limit = day.daily_limit.trim();
          day.price = day.price.trim();
        },
      );
      return true;
    }),

  body('prices')
    .optional()
    .custom(value => {
      // Validate each price object in the array
      JSON.parse(value).forEach((price: { price: string,limit:string }, index: any) => {
        if (typeof price.price !== 'string') {
          throw new Error(`Prize at index ${index} must have a valid prize string.`);
        }

        price.price = price.price.trim();
        price.limit = String(price.limit).trim();
      });
      return true;
    }),
];
