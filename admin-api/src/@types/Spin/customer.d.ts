declare module 'customer' {
    export interface CustomerInterface {
      id?: number;
      mobile_number: string;
      name: string;
      prize?: string;
      createdAt?: Date;
      updatedAt?: Date;
      deletedAt?: Date;
    }
  }
  