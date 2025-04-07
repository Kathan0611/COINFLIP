import { MemoryGameAttributes } from 'memory-game';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

class MemoryGame extends Model<MemoryGameAttributes> implements MemoryGameAttributes {
  declare id: number;
  declare game_time: number;
  declare total_cards: number;
  declare daily_limit: number;
  declare background_image?: string | null;
  declare card_cover_image: string;
  declare card_front_images: string[];
  declare rewards: MemoryGameAttributes['rewards'];
  declare game_theme?: MemoryGameAttributes['game_theme'];
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

MemoryGame.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    game_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    total_cards: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    daily_limit: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    background_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    card_cover_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_front_images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    game_theme: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    rewards: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: 'memory_game_configs',
    sequelize,
    paranoid: true,
    timestamps: true,
  },
);

export default MemoryGame;
