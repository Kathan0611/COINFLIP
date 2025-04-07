import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';
import { CustomerInterface } from 'customer';

interface Customer extends CustomerInterface {}

class Customer extends Model<CustomerInterface, Customer> {
  declare id?: number;
  declare mobile_number: string;
  declare name: string;
  declare prize?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    mobile_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    prize: {
      type: DataTypes.STRING(155),
      allowNull: true,
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
    tableName: 'spin_customers',
    sequelize,
    paranoid: true,
    timestamps: true,
  },
);

export default Customer;
