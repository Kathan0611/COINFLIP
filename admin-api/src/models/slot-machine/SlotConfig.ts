// src/models/SlotConfig.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { SlotConfigAttributes, ThemeConfig } from 'slot-config';

class SlotConfig extends Model<SlotConfigAttributes> implements SlotConfigAttributes {
  declare id?: number;
  declare slots: number;
  declare section: number;
  declare user_daily_limit: number;
  declare total_prize_limit: number;
  declare specific_combinations?: any;
  declare theme_config?: ThemeConfig[] | undefined;
  declare status: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date | undefined;
}

SlotConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    section: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_daily_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_prize_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specific_combinations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    theme_config: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'Slot_Machine_Config',
    sequelize,
    paranoid: true,
  }
);

export default SlotConfig;