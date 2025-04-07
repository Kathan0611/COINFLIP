declare module 'media' {
  export interface MediaInterface {
    id: number;
    media_path: string;
    media_type: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
