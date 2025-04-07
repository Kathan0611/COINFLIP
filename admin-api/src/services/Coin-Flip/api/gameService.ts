import UserLogs from '../../../models/coin-flip/UserLogs';
import CoinFlip from '../../../models/coin-flip/CoinFlip';
import { sendOTP, verifyOTP } from '../../../helpers/Coin-Flip/SmsHelper';
import { Op } from 'sequelize';

const randomFlip = (): 'head' | 'tail' => (Math.random() < 0.5 ? 'head' : 'tail');

const getGameConfig = async () => {
  const config = await CoinFlip.findOne();
  return config;
};

// Helper function to check user eligibility to play
const checkUserEligibility = async (mobile: string) => {
  const gameConfig = await getGameConfig();
  if (!gameConfig) return { success: false, error: 'GAME_CONFIG_NOT_FOUND' };

  // Determine if there's a daily limit
  const hasDailyLimit = gameConfig.daily_limit != null && gameConfig.daily_limit > 0;

  if (hasDailyLimit) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count the number of user logs for the given mobile in the last 24 hours.
    const logsInLast24Hours = await UserLogs.count({
      where: {
        mobile_number: mobile,
        createdAt: {
          [Op.between]: [twentyFourHoursAgo, now],
        },
      },
    });

    if (logsInLast24Hours >= gameConfig.daily_limit) {
      return { success: false, message: 'DAILY_LIMIT_EXCEEDED' };
    }
  }

  return { success: true, message: 'USER_ELIGIBLE_TO_PLAY' };
};

//save record in database
const saveFlip = async (
  user_name: string,
  mobile_number: string,
  prediction_value: 'head' | 'tail',
  flip_result: 'head' | 'tail',
  is_winner: boolean,
  price: number,
  message: string,
  is_special_day: boolean,
) => {
  return await UserLogs.create({
    user_name,
    mobile_number,
    prediction_value,
    flip_result,
    is_winner,
    price,
    message,
    is_special_day,
  });
};

//prize allocation function
const allocatePrize = async (
  user_name: string,
  prediction_value: 'head' | 'tail',
  flip_result: 'head' | 'tail',
  specialDay: boolean,
  mobile_number: string,
) => {
  const coinFlip = await CoinFlip.findOne();
  if (!coinFlip) return { price: 0, message: 'No game data available', is_special_day: false, successfully: false };

  let price = 0,
    message = 'Your win chance is over',
    is_winner = false,
    is_special_day = false,
    updated = false;

  const lastFlips = await UserLogs.findAll({
    where: { mobile_number },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  let forceLoseCount = lastFlips.filter(flip => flip.is_winner).length;
  if (forceLoseCount >= 1) {
    flip_result = prediction_value === 'head' ? 'tail' : 'head';

    is_winner = false;
    return await saveFlip(
      user_name,
      mobile_number,
      prediction_value,
      flip_result,
      is_winner,
      0,
      'Better luck next time!',
      false,
    );
  }

  // const todayStr = new Date().toISOString().split('T')[0];

  // const hasUserWonToday = await UserLogs.findOne({
  //   where: { mobile_number, is_special_day: true, createdAt: { [Op.gte]: new Date(todayStr) } },
  // });

  // if (hasUserWonToday)
  //   return {
  //     price: 0,
  //     message: 'You have already claimed today’s special prize',
  //     is_winner: true,
  //     flip_result,
  //     is_special_day: true,
  //     successfully: true,
  // };

  // if (specialDay && coinFlip.special_days?.length > 0) {
  //   // for (let day of coinFlip.special_days) {
  //   //   const today = new Date(todayStr);
  //   //   if (new Date(day.start_date) <= today && today <= new Date(day.end_date)) {
  //   //     if (Number(day.daily_limit) > 0) {
  //   //       price = Number(day.price);
  //   //       day.daily_limit -= 1;
  //   //       updated = true;
  //   //       is_special_day = true;
  //   //       break;
  //   //     }
  //   //   }
  //   // }
  //   if (updated) {
  //     await CoinFlip.update({ special_days: coinFlip.special_days }, { where: {} });
  //     return {
  //       price,
  //       message: 'Congratulations! You won a special day prize!',
  //       is_winner: true,
  //       flip_result,
  //       is_special_day,
  //       successfully: true,
  //     };
  //   }
  // }

  if (coinFlip.prices?.length > 0) {
    const randomIndex = Math.floor(Math.random() * coinFlip.prices.length);
    for (let i = 0; i < coinFlip.prices.length; i++) {
      const currentIndex = (randomIndex + i) % coinFlip.prices.length;
      let currentLimit = Number(coinFlip.prices[currentIndex].limit);
      if (currentLimit > 0) {
        price = coinFlip.prices[currentIndex].price;
        coinFlip.prices[currentIndex].limit = currentLimit - 1;
        updated = true;
        break;
      }
    }
  }

  if (updated) {
    // await CoinFlip.update({ prices: coinFlip.prices }, { where: {} });

    message = `Congratulation You won`;
    is_winner = true;
  } else {
    flip_result = prediction_value === 'head' ? 'tail' : 'head';
    coinFlip.prices = coinFlip.prices.map(priceObj => ({
      ...priceObj,
      limit: 5,
    }));
    await CoinFlip.update({ prices: coinFlip.prices }, { where: {} });
    message = `Better luck next time!`;
  }

  return { price, message, is_winner, flip_result, is_special_day, successfully: true };
};

const isSpecialDays = async (): Promise<boolean> => {
  const coinFlip = await CoinFlip.findOne();
  if (!coinFlip || !coinFlip.special_days) return false;

  const currentDate = new Date().toISOString().split('T')[0];
  return coinFlip.special_days.some((day: any) => {
    return day.start_date && day.end_date && currentDate >= day.start_date && currentDate <= day.end_date;
  });
};

// user otp service
export const sendOtpToUser = async (
  user_name: string,
  prediction_value: 'head' | 'tail',
  mobile_number: string,
  isAuth: boolean,
) => {
  if (isAuth) {
    const eligibility = await checkUserEligibility(mobile_number);
    if (!eligibility.success)
      return { success: false, message: 'You are not eligible,try again after 24 hours', successfully: false };

    const flip_result = randomFlip();
    let is_winner = flip_result === prediction_value;
    const specialDay = await isSpecialDays();
    const prizeResult = is_winner
      ? await allocatePrize(user_name, prediction_value, flip_result, specialDay, mobile_number)
      : {
          price: 0,
          message: 'Better luck next time!',
          is_winner: false,
          flip_result,
          is_special_day: false,
          successfully: false,
        };

    await saveFlip(
      user_name,
      mobile_number,
      prediction_value,
      flip_result,
      prizeResult?.is_winner || false,
      prizeResult.price,
      prizeResult.message,
      prizeResult.is_special_day,
    );
    return prizeResult;
  } else {
    const eligibility = await checkUserEligibility(mobile_number);
    if (!eligibility.success)
      return { success: false, message: 'You are not eligible,try again after 24 hours', successfully: false };

    await sendOTP(mobile_number);
    return { success: true, message: 'OTP sent successfully', successfully: true };
  }
};

//otp verified service
export const verifyOtpAndPlay = async (
  user_name: string,
  mobile_number: string,
  otp: string,
  prediction_value: 'head' | 'tail',
) => {
  const otpVerified = await verifyOTP(mobile_number, otp);

  if (!otpVerified.success) return { success: false, message: 'Invalid OTP', successfully: false };

  let flip_result = randomFlip();
  let is_winner = flip_result === prediction_value;

  const specialDay = await isSpecialDays();

  const prizeResult = is_winner
    ? await allocatePrize(user_name, prediction_value, flip_result, specialDay, mobile_number)
    : {
        price: 0,
        message: 'Better luck next time!',
        is_winner: false,
        flip_result,
        is_special_day: false,
        successfully: false,
      };

  await saveFlip(
    user_name,
    mobile_number,
    prediction_value,
    flip_result,
    prizeResult.is_winner ? prizeResult.is_winner : false,
    prizeResult.price,
    prizeResult.message,
    prizeResult.is_special_day,
  );

  if (prizeResult.flip_result) {
    flip_result = prizeResult.flip_result;
  }

  return {
    success: true,
    flip_result,
    is_winner: prizeResult.is_winner,
    price: prizeResult.price,
    message: prizeResult.message,
    is_special_day: prizeResult.is_special_day,
    successfully: true,
  };
};

/**
 * Fetch game configuration.
 */
export const gameConfig = async () => {
  try {
    const gamedata = await CoinFlip.findOne();
    return { headImage: gamedata?.head_image, tailImage: gamedata?.tail_image };
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
};
