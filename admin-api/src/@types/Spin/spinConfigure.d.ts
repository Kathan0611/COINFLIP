declare module 'spin-configure' {
  export interface SpinConfigure {
    id: string;
    slice_name: string;
    is_default: boolean;
    stripe_texts: {
      id: number;
      text: string;
      degree: number;
    }[];
    images: {
      pointer_img: string;
      button_img: string;
      circle_img: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
