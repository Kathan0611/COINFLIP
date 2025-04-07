import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import StoreManagement from './Store';
import TemplateModel from './template';
import { TemplateConfig } from 'template-config';

interface SpinConfig extends Optional<TemplateConfig, 'id'> {}

class TemplateConfigs extends Model<TemplateConfig, SpinConfig> implements TemplateConfig {
  declare id: string;
  declare template_id: string;
  declare is_default: boolean;
  declare total_prize_limit: number;
  declare stripe_texts: { id: number; text: string; image: Buffer; degree: number, color : string }[];
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

TemplateConfigs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    template_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: TemplateModel,
        key: 'id',
      },
      // onDelete: 'CASCADE',
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    total_prize_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stripe_texts: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'spin_template_config',
    sequelize,
    paranoid: true,
  },
);

export default TemplateConfigs;
