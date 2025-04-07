import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { SpinConfigure } from 'spin-configure';

interface Spin extends Optional<SpinConfigure, 'id'> {}

class SpinModel extends Model<SpinConfigure, Spin> implements SpinConfigure {
  declare id: string;
  declare slice_name: string;
  declare is_default: boolean;
  declare stripe_texts: { id: number; text: string; degree: number }[];
  declare images: { pointer_img: string; button_img: string; circle_img: string };
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

SpinModel.init(
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
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stripe_texts: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    images: {
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
    tableName: 'spins',
    sequelize,
    paranoid: true,
  },
);

export default SpinModel;
