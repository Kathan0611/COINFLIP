declare module 'user-logs' {
  export interface UserLogsAttributes {
    id?: number;
    name: string;
    mobile: string;
    score: number;
    reward: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
