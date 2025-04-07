// copy-assets.js
import fs from 'fs-extra';
import path from 'path';

export const copyAssets = async () => {
  const src = path.join(process.cwd(), 'src', 'assets');
  const dest = path.join(process.cwd(), 'dist', 'assets');

  try {
    await fs.copy(src, dest);
    console.log('Assets copied successfully.');
  } catch (err) {
    console.error('Error copying assets:', err);
  }
};
