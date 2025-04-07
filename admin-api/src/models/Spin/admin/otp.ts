import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';
import { OtpInterface } from 'otp';

interface Otp extends OtpInterface {}

class Otp extends Model<OtpInterface, Otp> {
  declare id: number;
  declare mobile_number: string;
  declare otp: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Otp.init(
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
    otp: {
      type: DataTypes.STRING(155),
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
  },
  {
    tableName: 'spin_otp',
    sequelize,
    timestamps: true,
  },
);

export default Otp;
