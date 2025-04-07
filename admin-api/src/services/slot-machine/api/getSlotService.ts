// src/services/api/slotService.ts
import SlotImage from '../../../models/slot-machine/SlotImage';
import SlotConfig from '../../../models/slot-machine/SlotConfig';
import { RESPONSES } from '../../../constants';

interface ISlotImageResponse {
  id: number;
  image_path: string;
  section_number: number;
}

// Updated IServiceResponse to include theme_config
interface IServiceResponse {
  status: boolean;
  message: string;
  data: {
    images: ISlotImageResponse[];
    backgroundImage?: string | null;
    slots: number; // Added slots count from active config
    theme_config?: any[]; // Optional theme configuration array
  };
}

export const getSlotImages = async (): Promise<IServiceResponse> => {
  try {
    // Find active slot configuration
    const activeConfig = await SlotConfig.findOne({
      where: { status: true },
    });

    if (!activeConfig) {
      return {
        status: false,
        message: RESPONSES.ERROR.SLOT_CONFIG_NOT_FOUND,
        data: { images: [], backgroundImage: null, slots: 0, theme_config: [] },
      };
    }

    // Get images for the active slot configuration including image_name so we can filter
    const slotImages = await SlotImage.findAll({
      where: { slot_config_id: activeConfig.id },
      attributes: ['id', 'image_path', 'section_number', 'image_name'],
    });

    // Convert to plain objects
    const imagesRaw = slotImages.map(image => image.toJSON());

    // Extract background image using the fixed name "background_image"
    const backgroundImage = imagesRaw.find((img: any) => img.image_name === 'background_image')?.image_path || null;

    // Filter out background image record
    const filteredImagesRaw = imagesRaw.filter((img: any) => img.image_name !== 'background_image');

    // Map to our response type (excluding image_name)
    const images: ISlotImageResponse[] = filteredImagesRaw.map((img: any) => ({
      id: img.id,
      image_path: img.image_path,
      section_number: img.section_number ?? 0,
    }));

    return {
      status: true,
      message: RESPONSES.SUCCESS.SLOT_IMAGES_FETCHED,
      data: {
        images,
        backgroundImage,
        slots: activeConfig.slots,
        theme_config: activeConfig.theme_config || []
      },
    };
  } catch (error) {
    return {
      status: false,
      message: RESPONSES.ERROR.SLOT_IMAGES_NOT_FETCHED,
      data: { images: [], backgroundImage: null, slots: 0, theme_config: [] },
    };
  }
};
