import { DataTypes, Model } from 'sequelize';
import { UserLogsAttributes } from 'user-logs';
import { sequelize } from '../../config/database';

class UserLogs extends Model<UserLogsAttributes> implements UserLogsAttributes {
  declare id: number;
  declare name: string;
  declare mobile: string;
  declare score: number;
  declare reward: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

UserLogs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    reward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'memory_game_logs',
    sequelize,
    paranoid: true,
    timestamps: true,
  },
);

export default UserLogs;
