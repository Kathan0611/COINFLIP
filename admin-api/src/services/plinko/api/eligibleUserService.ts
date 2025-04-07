import PlinkoGameUser from "../../../models/plinko/GameUserModel";
import GameConfig from "../../../models/plinko/ConfigModel";



interface UserInput {
    name: string;
    phoneNumber: string;
}
export const eligibleUserService = async ({ name, phoneNumber }: UserInput) => {
    const gameConfig = await GameConfig.findOne({ attributes: ['perDayLimit'] });
    let perDayLimit: number | null = null;
    if (gameConfig) {
        perDayLimit = gameConfig.perDayLimit;
    } else {
        console.log("Game configuration not found");
    }
    try {
        const today = new Date().toISOString().split("T")[0];
        const userlog: PlinkoGameUser[] = await PlinkoGameUser.findAll({ where: { phoneNumber } });
        if (!userlog) {
            return "IsEligible";
        }
        const logOfToday: PlinkoGameUser[] = userlog.filter((user) => user.updatedat.toISOString().split("T")[0] === today);

        if (perDayLimit) {
            if (logOfToday.length >= perDayLimit) {
                return "NotEligible";
            }
        } else {
            return { error: "PerDayLimit not found" };
        }

        return "IsEligible";
    } catch (error) {
        console.log(error);
        return { error: "USER_ELIGIBLE_FAILED" };
    };
};  
