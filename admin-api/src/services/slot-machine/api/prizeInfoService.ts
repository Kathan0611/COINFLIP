import { Response } from 'express';
import SlotConfig from '../../../models/slot-machine/SlotConfig';
import SlotImage from '../../../models/slot-machine/SlotImage';
import { RESPONSES } from '../../../constants';

interface PrizeInfo {
  images: string[];
  prize: string | null;
}

interface PrizeInfoResponse {
  info: PrizeInfo[];
}

export const getPrizeInfo = async (): Promise<{ status: boolean; message: string; data: PrizeInfoResponse }> => {
  try {
    const config = await SlotConfig.findOne({ where: { status: true } });
    if (!config) {
      return {
        status: false,
        message: RESPONSES.ERROR.SLOT_CONFIG_NOT_FOUND,
        data: { info: [] },
      };
    }

    // Get all slot images for this configuration.
    const slotImages = await SlotImage.findAll({
      where: { slot_config_id: config.id },
      attributes: ['image_path', 'section_number'],
    });

    // Build a mapping from section number to image path.
    const imageMap: { [key: number]: string } = {};
    slotImages.forEach(img => {
      if (img.section_number !== null && img.section_number > 0) {
        imageMap[img.section_number] = img.image_path;
      }
    });

    // Process each specific combination.
    const specificCombinations = config.specific_combinations || [];
    const info = specificCombinations.map((combo: any) => {

      const sections = (combo.combination || '').split('').map((d: string) => parseInt(d, 10));
      // Map the section numbers to image paths (filter out missing ones)
      const imagesForCombo = sections.map((sectionNum: number) => imageMap[sectionNum]).filter(Boolean);

      const prizeName = combo.prizes && combo.prizes.length > 0 ? combo.prizes[0].name : null;

      return { images: imagesForCombo, prize: prizeName };
    });

    return {
      status: true,
      message: RESPONSES.SUCCESS.SLOT_INFO_FETCHED, 
      data: { info },
    };
  } catch (error) {
    return {
      status: false,
      message: RESPONSES.ERROR.SLOT_INFO_NOT_FETCHED, 
      data: { info: [] },
    };
  }
};
