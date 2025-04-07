declare module 'game-user' {
  export interface PlinkoGameUserInterface {
    id: number;
    name: string;
    phoneNumber: string;
    reward: string;
    createdat: Date;
    updatedat: Date;
    deletedat?: Date | null;
  }
}
