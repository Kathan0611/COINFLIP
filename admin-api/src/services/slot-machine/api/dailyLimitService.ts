// src/services/api/dailyLimitService.ts

import { Op } from 'sequelize';
import SpinHistory from '../../../models/slot-machine/SpinHistory';
import SlotConfig from '../../../models/slot-machine/SlotConfig';
import { DailyLimitCheck } from 'slot-config';

/**
 * Check if user has reached daily spin limit
 * @param userNumber - Phone number of the user
 */
export const checkDailyLimit = async (userNumber: string): Promise<DailyLimitCheck> => {
  try {
    const config = await SlotConfig.findOne({ where: { status: true } });
    
    if (!config) {
      return { eligible: false };
    }

    // Count user spins in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const userSpins = await SpinHistory.count({
      where: {
        user_number: userNumber,
        createdAt: { [Op.gte]: twentyFourHoursAgo },
      },
      paranoid: false, // Disable paranoid mode to avoid filtering by deletedAt
    });

    // Check if user has reached daily limit
    return { 
      eligible: userSpins < config.user_daily_limit,
    };
  } catch (error) {
    return { eligible: false };
  }
};