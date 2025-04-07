import PlinkoGameUser from '../../../models/plinko/GameUserModel';


interface RegisterUserInput {
    name: string;
    phoneNumber: string;
}
export const registerGameUser = async ({ name,phoneNumber }: RegisterUserInput) => {
    try {
        const user = await PlinkoGameUser.findOne({ where: { phoneNumber } });
        if (user) {
            return { error: "USER_ALREADY_REGISTERED" };
        }
        else {

            const newUser = await PlinkoGameUser.create({ name, phoneNumber, reward: "NULL", createdat: new Date(), updatedat: new Date() });
            return newUser;
        }
    } catch (error) {
        console.log(error);
        return { error: "REGISTER_USER_FAILED" };
    };
}