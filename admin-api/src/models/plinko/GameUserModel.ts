import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { PlinkoGameUserInterface } from 'game-user';

interface GameUserCreationAttributes extends Optional<PlinkoGameUserInterface, 'id'> {}

class PlinkoGameUser extends Model<PlinkoGameUserInterface, GameUserCreationAttributes> implements PlinkoGameUserInterface {
  declare id: number;
  declare name: string;
  declare phoneNumber: string;
  declare reward: string;
  declare createdat: Date;
  declare updatedat: Date;
  declare deletedat?: Date | null;
}

PlinkoGameUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
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
    tableName: 'plinko_game_users',
    sequelize,
    timestamps: false,
  },
);

export default PlinkoGameUser;
