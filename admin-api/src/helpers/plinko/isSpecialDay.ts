import GameConfig from "../../models/plinko/ConfigModel";

export const isSpecialDay = async (): Promise<boolean> => {
    const currentDateTime = new Date();

    const gameConfig = await GameConfig.findOne({ attributes: ['specialday'] });

    const specialDays: Array<{ start: string; end: string }> = gameConfig?.specialday || [];

    if(!specialDays){
        return false;
    }

    return specialDays.some(({ start, end }) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return currentDateTime >= startDate && currentDateTime <= endDate;
    });
};
