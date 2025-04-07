import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { PageAttributesInterface } from 'page';

interface PageCreationAttributes extends PageAttributesInterface { }

class Page extends Model<PageAttributesInterface, PageCreationAttributes> {
	declare content: string;
	declare title: string;
	declare meta_title?: string;
	declare meta_desc?: string;
	declare meta_keywords?: string;
	declare slug: string;
	declare status: boolean;
	declare createdAt?: Date;
	declare updatedAt?: Date;
	declare deletedAt?: Date;
}

Page.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(155),
			allowNull: false,
		},
		meta_title: {
			type: DataTypes.STRING(155),
			allowNull: true,
		},
		meta_desc: {
			type: DataTypes.STRING(155),
			allowNull: true,
		},
		meta_keywords: {
			type: DataTypes.STRING(155),
			allowNull: true,
		},
		slug: {
			type: DataTypes.STRING(155),
			unique: true,
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
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
		tableName: 'pages',
		sequelize,
		paranoid: true, // Enable soft deletes if needed
	},
);

export default Page;