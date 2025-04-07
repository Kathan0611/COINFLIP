import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import AdminGroup from './AdminGroup';
import { AdminAttributesInterface } from 'admin';



interface AdminCreationAttributes extends Optional<AdminAttributesInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

class Admin extends Model<AdminAttributesInterface, AdminCreationAttributes> implements AdminAttributesInterface {
  declare id: number;
  declare admin_group_id: number;
  declare name: string;
  declare email: string;
  declare status: boolean;
  declare password: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;

  declare admin_group?: AdminGroup; // This property is for TypeScript's type inference
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    admin_group_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(155),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(155),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    password: {
      type: new DataTypes.STRING(155),
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
    tableName: 'admins',
    sequelize,
    paranoid: true,
    timestamps: true,
  },
);

export default Admin;
