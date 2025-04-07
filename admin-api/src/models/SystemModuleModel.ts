import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { SystemModuleInterface } from 'system-module';

interface AdminGroupCreationAttributes extends Optional<SystemModuleInterface, 'id'> { }

class SystemModuleGroup extends Model<SystemModuleInterface, AdminGroupCreationAttributes> implements SystemModuleInterface {
	declare id: number;
	declare module_name: string;
	declare action?: string;
	declare createdAt?: Date;
	declare updatedAt?: Date;
	declare deletedAt?: Date;
}

SystemModuleGroup.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		module_name: {
			type: new DataTypes.STRING(155),
			allowNull: false,
			unique: true,
		},
		action: {
			type: DataTypes.TEXT,
			allowNull: true,
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
		tableName: 'system_modules',
		sequelize,
		paranoid: true, // Enable soft deletes if needed
	},
);

export default SystemModuleGroup;