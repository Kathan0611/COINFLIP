import GameConfig from '../../models/plinko/ConfigModel';

interface rewardArray {
  index: number;
  reward: string;
  rewardCount: number;
}

// Helper function to retrieve the reward count array
export const getRewardArray = async (): Promise<rewardArray[]> => {
  const gameConfig = await GameConfig.findOne({ attributes: ['rewards'] });
  if (!gameConfig || !gameConfig.rewards) {
    throw new Error('Game config rewards not found');
  }

  // Convert each reward item from a JSON string to an object if needed
  const rewardsArray = (gameConfig.rewards as any[]).map(item => {
    if (typeof item === 'string') {
      try {
        return JSON.parse(item);
      } catch (error) {
        throw new Error('Failed to parse reward item: ' + item);
      }
    }
    return item;
  }) as Array<{ index: number; reward: string; rewardCount: number }>;

  // Find the reward object with the matching index and count
  return rewardsArray;
};
