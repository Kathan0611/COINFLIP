declare module 'RewardHistory' {
  export interface RewardHistory {
    id: string;
    template_id: string;
    customer_id: string;
    slice_count: number;
    prize: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
