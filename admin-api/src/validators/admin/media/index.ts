//src/validators/media/index.ts
import { body } from 'express-validator';
import { RESPONSES } from '../../../constants';

export const validateImagesUpload =  [
	body('images')
	  .custom((_, { req }) => {
		if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
		  throw new Error(RESPONSES.ERROR.IMAGE_REQUIRED);
		}
		return true;
	  })
	  .withMessage(RESPONSES.ERROR.IMAGE_REQUIRED)
];