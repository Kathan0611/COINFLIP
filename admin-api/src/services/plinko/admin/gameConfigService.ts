import GameConfig from "../../../models/plinko/ConfigModel";
import { GameAttributesInterface } from "admin-game";

export const setGameConfig = async (data: GameAttributesInterface) => {
    try {
        let gameConfig = await GameConfig.findOne();

        if (!gameConfig) {
            gameConfig = await GameConfig.create(data);
        } else {
            await gameConfig.update(data);
        }

        return { success: "GAME_CONFIG_UPDATED", data: gameConfig };
    } catch (error) {
        console.error("Error in setGameConfig:", error);
        return { error: "SET_GAME_CONFIG_FAILED" };
    }
};

export const getGameConfig = async () => {
    try {
        const gameConfig = await GameConfig.findOne();
        if (!gameConfig) {
            return { error: "GAME_CONFIG_NOT_FOUND" };
        }
        return { success: "GAME_CONFIG_FETCHED", data: gameConfig };
    } catch (error) {
        console.error("Error in getGameConfig:", error);
        return { error: "GET_GAME_CONFIG_FAILED" };
    }
};
