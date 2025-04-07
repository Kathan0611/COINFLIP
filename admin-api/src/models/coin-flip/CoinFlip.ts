import { DataTypes, Model, NUMBER, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { CoinflipAttributesInterface } from 'coin-flip';
import { SpecialDaysAttributesInterface } from 'coin-flip';
import { PricesAttributesInterface } from 'coin-flip';

interface CoinFlipCreationAttributes extends Optional<CoinflipAttributesInterface, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the CoinFlip model
class CoinFlip extends Model<CoinflipAttributesInterface, CoinFlipCreationAttributes> implements CoinflipAttributesInterface {
  declare id: number;
  declare head_image: string;
  declare tail_image: string;
  declare special_days: SpecialDaysAttributesInterface[];// JSON field for special days
  declare prices: PricesAttributesInterface[]; // JSON field for price values
  declare daily_limit: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}


//coinFlip model
CoinFlip.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    head_image: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    tail_image: {
      type: DataTypes.STRING,  
      allowNull: true,
    },
    special_days: {
      type: DataTypes.JSON,  
      allowNull: true,
    },
    prices: {
      type: DataTypes.JSON,  
      allowNull: true,
    },
    daily_limit:{
       type:DataTypes.INTEGER.UNSIGNED,
       allowNull:false,
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
    tableName: 'coin_flip_config',
    timestamps: true,
    underscored: true,  // Converts camelCase to snake_case in DB
    paranoid: false,  // Soft deletes are unablenabled
    sequelize,
  },
);

export default CoinFlip;
