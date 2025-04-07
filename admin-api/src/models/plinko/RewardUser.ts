import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { RewardUserInterface } from 'rewardUser';

interface RewardUserCreationAttributes extends Optional<RewardUserInterface, 'id'> {}

class RewardUser extends Model<RewardUserInterface, RewardUserCreationAttributes> implements RewardUserInterface {
  declare id: number;
  declare name: string;
  declare phoneNumber: string;
  declare reward: string;
  declare createdat: Date;
  declare updatedat: Date;
  declare deletedat?: Date;
}

RewardUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    phoneNumber: {
      type: new DataTypes.STRING(20),
      allowNull: false,
    },
    reward: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'plinko_reward_users',
    sequelize,
    timestamps: false,
  },
);

export default RewardUser;
