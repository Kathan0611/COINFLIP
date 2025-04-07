declare module 'rewardUser' {
  export interface RewardUserInterface {
    id: number;
    name: string;
    phoneNumber: string;
    reward: string;
    createdat: Date;
    updatedat: Date;
    deletedat?: Date;
  }
}
