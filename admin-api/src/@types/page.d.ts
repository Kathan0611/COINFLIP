declare module 'page' {
    export interface PageAttributesInterface {
        id?: number;
        content: string;
        title: string;
        meta_title?: string;
        meta_desc?: string;
        meta_keywords?: string;
        slug?: string;
        status: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date;
    }
  }
  