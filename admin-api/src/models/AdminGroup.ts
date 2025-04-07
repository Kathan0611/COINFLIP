import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Admin from './Admin';
import { AdminGroupAttributes } from 'admin-group';

interface AdminGroupCreationAttributes extends Optional<AdminGroupAttributes, 'id'> {}

class AdminGroup extends Model<AdminGroupAttributes, AdminGroupCreationAttributes> implements AdminGroupAttributes {
  declare id: number;
  declare admin_group_name: string;
  declare status?: boolean;
  declare permission?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;

  declare users?: Admin[];
}

AdminGroup.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_group_name: {
      type: new DataTypes.STRING(155),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    permission: {
      type: DataTypes.TEXT,
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
    tableName: 'admin_groups',
    sequelize,
    paranoid: true, // Enable soft deletes if needed
  },
);

export default AdminGroup;
