import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { Template } from 'template';

interface Spin extends Optional<Template, 'id'> {}

class Templates extends Model<Template, Spin> implements Template {
  declare id: string;
  declare slice_name: string;
  declare slice_count: number;
  declare images: { pointer_img: string; button_img: string; circle_img: string };
  declare prize_limit: {
    id: string;
    limit: number;
  };
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

Templates.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slice_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slice_count: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    prize_limit: {
      type: DataTypes.JSON,
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
    tableName: 'spin_template',
    sequelize,
    paranoid: true,
  },
);

export default Templates;
