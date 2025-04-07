//src/services/admin/systemModuleService.ts
import { SystemModuleInterface } from "system-module";
import SystemModuleGroup from "../../models/SystemModuleModel";

export const getSystemModuleList = async (): Promise<SystemModuleInterface[]> => {
	try {
		const systemModules = await SystemModuleGroup.findAll();
		return systemModules.map((obj) => ({ ...obj.get({ plain: true }), action: obj.action}));
	} catch (error) {
		throw new Error('Something went wrong.');
	}
}