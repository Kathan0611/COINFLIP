import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { UserOtpInterface } from 'userotp';

interface UserOtpCreationAttributes extends Optional<UserOtpInterface, 'id'> {}

class UserOtp extends Model<UserOtpInterface, UserOtpCreationAttributes> implements UserOtpInterface {
  declare id: number;
  declare phoneNumber: string;
  declare otp: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;
}

UserOtp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: new DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    otp: {
      type: new DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'plinko_userotps',
    sequelize,
    timestamps: false,
  },
);

export default UserOtp;
