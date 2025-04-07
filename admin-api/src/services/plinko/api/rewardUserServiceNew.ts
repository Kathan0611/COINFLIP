import PlinkoGameUser from '../../../models/plinko/GameUserModel';
import RewardUser from '../../../models/plinko/RewardUser';
import GameConfig from '../../../models/plinko/ConfigModel';

import { eligibleUserService } from '../../../services/plinko/api/eligibleUserService';
import { getRewardArray } from '../../../helpers/plinko/getRewardArray';

interface UserInput {
  name: string;
  phoneNumber: string;
}

export const rewardUserService = async ({ name, phoneNumber }: UserInput) => {
  try {
    const eligible = await eligibleUserService({ name, phoneNumber });
    if (eligible === 'NotEligible') {
      return { eligible: false };
    }

    const config = (await GameConfig.findOne({ attributes: ['totalPrizeCount'] })) as GameConfig;
    const totalPrizeCount = config.totalPrizeCount;
    const rewardedUserCount = await RewardUser.count();

    if (rewardedUserCount >= totalPrizeCount) {
      // Delete all records from RewardUser as all prizes have been allocated.
      await RewardUser.destroy({ where: {} });
    }

    let rewardArray = await getRewardArray();
    // only available reward with count > 0
    let availableReward = [];

    for (const reward of rewardArray) {
      const allocatedRewardCount = await RewardUser.count({ where: { reward: reward.reward } });

      //only includeing reward which is not allocated to all users as per limit
      if (allocatedRewardCount < reward.rewardCount) {
        availableReward.push(reward);
      }
    }

    if (availableReward.length === 0) {
      return { eligible: false, error: 'NO_REWARD_AVAILABLE' };
    }

    const rewardIndex = Math.floor(Math.random() * availableReward.length);
    const selectReward = availableReward[rewardIndex];

    // Create a record for the rewarded user.
    await RewardUser.create({
      name: name,
      phoneNumber,
      reward: selectReward.reward,
      createdat: new Date(),
      updatedat: new Date(),
    });

    await PlinkoGameUser.create({
      name: name,
      phoneNumber,
      reward: selectReward.reward,
      createdat: new Date(),
      updatedat: new Date(),
    });

    return { rewardIndex: rewardIndex, eligible: true };
  } catch (error) {
    console.log('REWARD SERVICE:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'REWARD_USER_FAILED' };
  }
};
