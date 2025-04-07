declare module 'system-module' {
    export interface SystemModuleInterface {
        id: number;
        module_name: string;
        action?: string;
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date;
    }
  }
  