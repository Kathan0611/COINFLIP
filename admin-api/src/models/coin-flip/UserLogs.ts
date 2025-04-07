import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { CoinFlipRecord } from 'coin-flip';

// Define the interface for UserLogs attributes
interface UserLogsAttributesInterface extends CoinFlipRecord {
  id: number;
  user_name: string;
  mobile_number: string;
  prediction_value: 'head' | 'tail';
  flip_result: 'head' | 'tail';
  is_winner: boolean;
  price: number;
  message: string;
  is_special_day: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Define the creation attributes (optional fields)
interface UserLogsCreationAttributes extends Optional<UserLogsAttributesInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

// Define the UserLogs model
class UserLogs extends Model<UserLogsAttributesInterface, UserLogsCreationAttributes> implements UserLogsAttributesInterface {
  declare id: number;
  declare user_name: string;
  declare mobile_number: string;
  declare prediction_value: 'head' | 'tail';
  declare flip_result: 'head' | 'tail';
  declare is_winner: boolean;
  declare price: number;
  declare message: string;
  declare is_special_day: boolean;
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
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prediction_value: {
      type: DataTypes.ENUM('head', 'tail'),
      allowNull: false,
    },
    flip_result: {
      type: DataTypes.ENUM('head', 'tail'),
      allowNull: false,
    },
    is_winner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_special_day: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'coin_flip_logs',
    sequelize,
    paranoid: true, // Enables soft delete using `deletedAt`
    timestamps: true, 
  }
);

export default UserLogs;
