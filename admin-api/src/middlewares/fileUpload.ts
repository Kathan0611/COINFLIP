import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Define MIME_TYPE_MAP with the correct types
const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
};

// Use the absolute path for assets folder uploads
const mediaDir = path.resolve(process.cwd(), 'src/assets/uploads/media');

export const multiFileUpload = multer({
  storage: multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      // Ensure the media folder exists
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
      }
      cb(null, mediaDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      const filename = `media_${uuidv4()}.${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5000000 }, // Limits file size to 5MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: any) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];

    if (isValid) {
      cb(null, true);
    } else {
      // Use type 'any' for the callback to bypass TypeScript's strict checking
      cb(new Error(`Invalid MIME type: ${file.mimetype}`), false);
    }
  },
});
