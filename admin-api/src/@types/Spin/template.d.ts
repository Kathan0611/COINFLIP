declare module 'template' {
  export interface Template {
    id: string;
    slice_name: string;
    slice_count: number;
    images: {
      pointer_img: string;
      button_img: string;
      circle_img: string;
    };
    prize_limit: {
      id: string;
      limit: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
