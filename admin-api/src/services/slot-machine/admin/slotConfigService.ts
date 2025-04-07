import { SlotConfigAttributes, SlotConfigFormData, SlotImageAttributes } from 'slot-config';
import { sequelize } from '../../../config/database';
import SlotConfig from '../../../models/slot-machine/SlotConfig';
import SlotImage from '../../../models/slot-machine/SlotImage';
import { RESPONSES } from '../../../constants';
import fs from 'fs';
import path from 'path';

interface IServiceResponse {
  status: boolean;
  message: string;
  data?: any;
}

const parseFormData = (formData: SlotConfigFormData): SlotConfigAttributes => {
  return {
    slots: parseInt(formData.slots),
    section: parseInt(formData.section),
    user_daily_limit: parseInt(formData.user_daily_limit),
    total_prize_limit: parseInt(formData.total_prize_limit),
    specific_combinations: formData.specific_combinations ? JSON.parse(formData.specific_combinations) : [],
    theme_config: formData.theme_config ? JSON.parse(formData.theme_config) : [],
    status: formData.status === 'false' ? false : true,
  };
};

export const createSlotConfig = async (
  formData: SlotConfigFormData,
  files: { [fieldname: string]: Express.Multer.File[] },
): Promise<IServiceResponse> => {
  const transaction = await sequelize.transaction();
  try {
    // Ensure the media folder exists
    const mediaDir = path.resolve(process.cwd(), 'src/assets/uploads/media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
      console.log('Created media folder at:', mediaDir);
    }

    // Find existing active config
    let config = await SlotConfig.findOne({ where: { status: true }, transaction });
    const configData = parseFormData(formData);

    if (config) {
      // Update existing config so that the ID remains the same.
      await config.update(configData, { transaction });

      // Delete old images from the media folder
      const oldImages = await SlotImage.findAll({ where: { slot_config_id: config.id }, transaction });
      for (const image of oldImages) {
        const filePath = path.join(mediaDir, image.image_path);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('Deleted old image:', filePath);
          } catch (err) {
            console.error('Error deleting file:', filePath, err);
          }
        }
      }

      // Remove image records from the database and reset auto-increment
      await SlotImage.destroy({ where: { slot_config_id: config.id }, transaction, force: true });
      await sequelize.query('ALTER TABLE Slot_Machine_Images AUTO_INCREMENT = 1', { transaction });
    } else {
      // If no config exists, create one with an explicit ID of 1
      configData.id = 1;
      config = await SlotConfig.create(configData, { transaction });
    }

    // Since the middleware uploads files under keys "BackgroundImage" and "images",
    // extract them accordingly.
    const backgroundFiles = files['BackgroundImage'] || [];
    const sectionFiles = files['images'] || [];

    // Create image records for section images.
    const imageRecords: SlotImageAttributes[] = sectionFiles.map((file, index) => ({
      slot_config_id: config.id!, // non-null because config exists
      image_name: file.originalname,
      image_path: file.filename,
      section_number: index + 1,
    }));

    // For the background image, use a sentinel value (0) to indicate it's not part of sections.
    if (backgroundFiles.length > 0) {
      imageRecords.push({
        slot_config_id: config.id!,
        image_name: "background_image",
        image_path: backgroundFiles[0].filename,
        section_number: null, // sentinel value for background image
      });
    }

    await SlotImage.bulkCreate(imageRecords, { transaction });
    await transaction.commit();

    return { status: true, message: RESPONSES.SUCCESS.SLOT_CONFIG_CREATED, data: config };
  } catch (error) {
    await transaction.rollback();
    console.error('createSlotConfig error:', error);
    return { status: false, message: RESPONSES.ERROR.GENERIC };
  }
};

export const getSlotConfig = async (): Promise<IServiceResponse> => {
  try {
    const config = await SlotConfig.findOne({
      where: { status: true },
      include: [
        {
          model: SlotImage,
          attributes: ['id', 'image_path', 'section_number', 'image_name'],
        },
      ],
    });

    if (!config) {
      return { status: false, message: RESPONSES.ERROR.SLOT_CONFIG_NOT_FOUND };
    }

    // Convert instance to JSON for manipulation
    const configJSON: any = config.toJSON();

    // Separate out the background image record (with section_number = 0)
    let backgroundImage = null;
    if (configJSON.SlotImages && Array.isArray(configJSON.SlotImages)) {
      configJSON.SlotImages = configJSON.SlotImages.filter((img: any) => {
        if (img.image_name === "background_image") {
          backgroundImage = img.image_path;
          return false;
        }
        return true;
      });
    }
    // Attach the background image field at the top level
    configJSON.backgroundImage = backgroundImage;

    return { status: true, message: RESPONSES.SUCCESS.SLOT_CONFIG_FETCHED, data: configJSON };
  } catch (error) {
    console.error('getSlotConfig error:', error);
    return { status: false, message: RESPONSES.ERROR.GENERIC };
  }
};
