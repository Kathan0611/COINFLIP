declare module 'admin-group' {
  export interface AdminGroupAttributes {
    id: number;
    admin_group_name: string;
    status?: boolean;
    permission?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
