declare module 'admin-game' {
    export interface GameAttributesInterface {
      id?: number;
      specialday?: Array<{
        start: string;
        end: string;
      }>;
      backgroundColor: string;
      dotobstaclesColor: string;
      sideobstaclesColor: string;
      ballColor: string;
      arrowImage: string;
      perDayLimit: number;
      totalPrizeCount: number;
      rewards: Array<{
        index: number;
        reward: string;
        rewardCount: number;
      }>;
    }
  }