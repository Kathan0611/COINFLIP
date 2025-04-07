declare module 'stores' {
  export interface StoreInterface {
    id: number;
    store_name: string;
    store_owner: string;
    min_spend_amount: number;
    location: string;
    mobile: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
