import { multiFileUpload } from '../fileUpload';
import dotenv from 'dotenv';

dotenv.config();

const MAX_CARDS = parseInt(process.env.MEMORY_GAME_MAX_CARDS!, 10);
const MAX_FILES = MAX_CARDS / 2;

// Configure Multer to handle the file fields:
export const uploadGameFields = multiFileUpload.fields([
  { name: 'background_image', maxCount: 1 },
  { name: 'card_cover_image', maxCount: 1 },
  { name: 'card_front_images', maxCount: MAX_FILES },
]);
