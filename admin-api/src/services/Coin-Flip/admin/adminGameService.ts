import CoinFlip from '../../../models/coin-flip/CoinFlip';
import { CoinflipAttributesInterface, SpecialDaysAttributesInterface } from 'coin-flip';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../src/assets/uploads/media');

// Ensure the media directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

//  create or update service for CoinFlip
export const createOrUpdateCoinFlip = async (
  head_image: string,
  tail_image: string,
  special_days: SpecialDaysAttributesInterface[],
  prices: any,
  daily_limit: number,
) => {
  try {
    let coinFlip = await CoinFlip.findOne({});

    if (coinFlip) {
      const dataToUpdate: Partial<CoinflipAttributesInterface> = {
        special_days,
        prices,
        daily_limit,
      };

      if (head_image && coinFlip.head_image !== head_image) {
        deleteFile(coinFlip.head_image);
        dataToUpdate.head_image = head_image;
      }

      if (tail_image && coinFlip.tail_image !== tail_image) {
        deleteFile(coinFlip.tail_image);
        dataToUpdate.tail_image = tail_image;
      }

      await CoinFlip.update(dataToUpdate, { where: {} });

      coinFlip = await CoinFlip.findOne();
    } else {
      // otherwise Create
      coinFlip = await CoinFlip.create({
        head_image,
        tail_image,
        special_days,
        prices,
        daily_limit,
      });
    }

    return coinFlip;
  } catch (error) {
    console.error('Error in createOrUpdateCoinFlip:', error);
    return { error: 'GENERIC' };
  }
};

// Fetch CoinFlip
export const getCoinFlip = async () => {
  try {
    const result = await CoinFlip.findOne();

    if (!result) {
      return { error: 'COINFLIP_CONFIG_NOT_FOUND' };
    }

    return result;
  } catch (error) {
    console.error('Error fetching CoinFlip:', error);
    return { error: 'GENERIC' };
  }
};

// Handler for deleteFile
const deleteFile = (filePath: string) => {
  if (!filePath) return;

  const absolutePath = path.join(UPLOAD_DIR, path.basename(filePath));

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    // console.log(`Deleted old file: ${absolutePath}`);
  }
};
