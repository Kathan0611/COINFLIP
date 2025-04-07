import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { StoreInterface } from 'stores';

interface StoreCreationAttributes extends Optional<StoreInterface, 'id'> {}

class Stores extends Model<StoreInterface, StoreCreationAttributes> implements StoreInterface {
  declare id: number;
  declare store_name: string;
  declare store_owner: string;
  declare location: string;
  declare min_spend_amount: number;
  declare mobile: string;
  declare status?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

Stores.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    store_name: {
      type: DataTypes.STRING(155),
      allowNull: false,
      unique: true,
    },
    store_owner: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(155),
      allowNull: false,
      unique: true,
    },
    min_spend_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'stores',
    sequelize,
    paranoid: true,
  },
);

export default Stores;
