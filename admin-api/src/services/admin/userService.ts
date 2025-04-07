//src/services/admin/userService.ts
import { Admin } from "../../models";
import bcrypt from 'bcryptjs';


export const updateUser = async (
	id: number,
	name: string,
	password?: string,
) => {
	const userFound = await Admin.findOne({ where: { id: id } });
	if (!userFound) return { error: 'USER_NOT_FOUND' };
	const requestParam = {
		name,
		...(password && password !== '' && { password: bcrypt.hashSync(password, 10) }),
	};
	const [updatemsg] = await Admin.update(requestParam, { where: { id } });
	if (!updatemsg) {
		return { error: 'USER_DETAIL_UPDATE_FAILED' };
	}
	return true;
};