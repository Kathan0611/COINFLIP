import { DataTypes, Model } from "sequelize";
import { MediaInterface } from "media";
import { sequelize } from '../config/database';


interface MediaAttributes extends MediaInterface { }

class Media extends Model<MediaInterface, MediaAttributes> {
	declare media_path: string;
	declare media_type: string;
	declare createdAt?: Date;
	declare updatedAt?: Date;
	declare deletedAt?: Date;
}

Media.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		media_path: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		media_type: {
			type: DataTypes.STRING(155),
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
		tableName: 'medias',
		sequelize,
		paranoid: true, // Enable soft deletes if needed
	},
);

export default Media;