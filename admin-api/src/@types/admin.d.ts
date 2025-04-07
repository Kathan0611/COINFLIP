declare module 'admin' {
  export interface AdminAttributesInterface {
    id: number;
    admin_group_id: number;
    name: string;
    email: string;
    status: boolean;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
