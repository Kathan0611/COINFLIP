import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { RewardHistory } from 'RewardHistory';

interface Rewards extends Optional<RewardHistory, 'id'> {}

class RewardsHistory extends Model<RewardHistory, Rewards> implements RewardHistory {
  declare id: string;
  declare template_id: string;
  declare customer_id: string;
  declare slice_count: number;
  declare prize: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

RewardsHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    template_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slice_count: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prize: {
      type: DataTypes.STRING(255),
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
    tableName: 'spin_rewards',
    sequelize,
    paranoid: true,
  },
);

export default RewardsHistory;
