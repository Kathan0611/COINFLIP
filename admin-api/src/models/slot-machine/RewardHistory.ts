// src/models/RewardHistory.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export interface RewardHistoryAttributes {
  id?: number;
  prize: string;
  cust_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class RewardHistory extends Model<RewardHistoryAttributes> implements RewardHistoryAttributes {
  declare id?: number;
  declare prize: string;
  declare cust_id: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

RewardHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cust_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'spin_histories',
        key: 'id',
      },
    },
  },
  {
    tableName: 'Slot_Machine_Reward_History',
    sequelize,
    // Disable soft deletes as we want hard deletes in the future.
    paranoid: false,
  }
);

export default RewardHistory;
