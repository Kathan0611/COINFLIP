import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';
import { BlockCustomersInterface } from 'block-customer';

interface BlockCustomers extends BlockCustomersInterface {}

class BlockCustomers extends Model<BlockCustomersInterface, BlockCustomers> {
  declare id: number;
  declare mobile_number: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

BlockCustomers.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    mobile_number: {
      type: DataTypes.TEXT,
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
    tableName: 'block-customers',
    sequelize,
    paranoid: true,
  },
);

export default BlockCustomers;
