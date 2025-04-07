import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { SpinHistoryAttributes, SpinResult } from 'slot-config';

class SpinHistory extends Model<SpinHistoryAttributes> implements SpinHistoryAttributes {
  declare id?: number;
  declare user_name: string;
  declare user_number: string;
  declare result: SpinResult;
  declare prize_name?: string | null;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

SpinHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.ENUM('win', 'loss'),
      allowNull: false,
    },
    prize_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Slot_Machine_Logs',
    sequelize,
    paranoid: true, // Enable soft delete functionality
  },
);

export default SpinHistory;
