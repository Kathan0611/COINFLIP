import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { GameAttributesInterface } from 'admin-game';

interface GameCreationAttributes extends Optional<GameAttributesInterface, 'id'> {}

class GameConfig extends Model<GameAttributesInterface, GameCreationAttributes> implements GameAttributesInterface {
  declare id?: number;
  declare specialday?: Array<{
    start: string;
    end: string;
  }>;
  declare noRewardCount: number;
  declare backgroundColor: string;
  declare dotobstaclesColor: string;
  declare sideobstaclesColor: string;
  declare ballColor: string;
  declare arrowImage: string;
  declare perDayLimit: number;
  declare totalPrizeCount: number;
  declare rewards: Array<{
    index: number;
    reward: string;
    rewardCount: number;
  }>;
}

GameConfig.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    specialday: {
      // Change here from ARRAY(JSON) to JSON
      type: DataTypes.JSON,
      allowNull: false,
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dotobstaclesColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sideobstaclesColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ballColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arrowImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perDayLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrizeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rewards: {
      // Change here as well from ARRAY(JSON) to JSON
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: 'plinko_game_config',
    sequelize,
    timestamps: false,
  },
);

export default GameConfig;
