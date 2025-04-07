import GameConfig  from "../../models/plinko/ConfigModel";
// Helper function to retrieve the reward string based on rewardIndex
export const getRewardStringByIndex = async (rewardIndex: number): Promise<string> => {
    const gameConfig = await GameConfig.findOne({ attributes: ['rewards'] });
    if (!gameConfig || !gameConfig.rewards) {
        throw new Error("Game config rewards not found");
    }

    // Convert each reward item from a JSON string to an object if needed
    const rewardsArray = (gameConfig.rewards as any[]).map(item => {
        if (typeof item === "string") {
            try {
                return JSON.parse(item);
            } catch (error) {
                throw new Error("Failed to parse reward item: " + item);
            }
        }
        return item;
    }) as Array<{ index: number; reward: string }>;

    // Find the reward object with the matching index
    const rewardObj = rewardsArray.find(r => r.index === rewardIndex);
    if (!rewardObj) {
        throw new Error(`Reward not found for index: ${rewardIndex}`);
    }
    return rewardObj.reward;
};