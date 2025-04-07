import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import SlotConfig from './SlotConfig';
import { SlotImageAttributes } from 'slot-config';

class SlotImage extends Model<SlotImageAttributes> implements SlotImageAttributes {
  declare id?: number;
  declare slot_config_id: number;
  declare image_name: string;
  declare image_path: string;
  declare section_number: number | null; // Updated to allow null
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

SlotImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slot_config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section_number: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null for background image
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'Slot_Machine_Images',
    sequelize,
    paranoid: false,
  },
);

// Define association
SlotImage.belongsTo(SlotConfig, { foreignKey: 'slot_config_id' });
SlotConfig.hasMany(SlotImage, { foreignKey: 'slot_config_id' });

export default SlotImage;
