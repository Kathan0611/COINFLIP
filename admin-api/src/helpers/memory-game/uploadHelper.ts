import fs from 'fs';
import path from 'path';
import { __dirname } from '../../';

interface ConfigFiles {
  [fieldname: string]: Express.Multer.File[];
}

// To return realtive path of images
export const getImages = (
  files: ConfigFiles | undefined,
): { background_image?: string; card_cover_image?: string; card_front_images?: string[] } => {
  const background_image =
    files?.['background_image'] && files['background_image'].length > 0
      ? `${files['background_image'][0].filename}`
      : undefined;

  const card_cover_image =
    files?.['card_cover_image'] && files['card_cover_image'].length > 0
      ? `${files['card_cover_image'][0].filename}`
      : undefined;

  const card_front_images =
    files?.['card_front_images'] && files['card_front_images'].length > 0
      ? files['card_front_images'].map(file => `${file.filename}`)
      : undefined;

  return { background_image, card_cover_image, card_front_images };
};

/**
 * Delete a file given its public path
 * This function converts it into the actual file system path.
 */
export const deleteFile = async (publicPath: string): Promise<void> => {
  // Extract filename from public path
  const filename = path.basename(publicPath);
  // Construct full path to file on disk
  const fullPath = path.join(__dirname, '../src/assets/uploads/media', filename);
  try {
    await fs.promises.unlink(fullPath);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // File doesn't exist; we can ignore this error.
      console.warn(`File not found, skipping deletion: ${fullPath}`);
    } else {
      console.error(`Error deleting file ${fullPath}:`, err);
    }
  }
};
