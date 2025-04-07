declare module 'template-config' {
  export interface TemplateConfig {
    id: string;
    template_id: string;
    is_default: boolean;
    total_prize_limit: number;
    stripe_texts: {
      id: number;
      text: string;
      image: Buffer;
      degree: number;
      color: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
