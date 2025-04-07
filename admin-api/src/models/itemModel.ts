import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ItemAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'items',
    sequelize,
  }
);

export default Item;
