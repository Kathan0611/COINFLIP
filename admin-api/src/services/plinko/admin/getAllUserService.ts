import PlinkoGameUser from '../../../models/plinko/GameUserModel';
import { Sequelize,Op } from 'sequelize';

export const getGameUsers = async () => {
  try {
    const gameUsers = await PlinkoGameUser.findAll({
      where: 
        Sequelize.literal('deletedat IS NULL'),
      
    });

    console.log("gameUsers", gameUsers);

    return gameUsers;
  } catch (error) {
    return { error: 'GET_GAME_USERS_FAILED' };
  }
};

export const deleteGameUserLog = async (id:number) => {
  try {
    // Keep the date format as is, but cast it to DATETIME for comparison
    const users = await PlinkoGameUser.findAll({where:{
      id:id,
      deletedat: 
       Sequelize.literal('deletedat IS NULL'),
      
    }});
    console.log("users",users);
    if (users.length === 0) {
      return { error: 'USER_NOT_FOUND' };
    }

    await PlinkoGameUser.update(
      { deletedat: new Date() },
      {
        where:{id:id},
      },
    );
    return { success: 'DELETE_GAME_USERS_SUCCESS' };
  } catch (error) {
    console.error(error);
    return { error: 'DELETE_GAME_USERS_FAILED' };
  }
};
