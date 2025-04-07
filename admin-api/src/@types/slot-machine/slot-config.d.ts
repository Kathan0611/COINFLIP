// src/@types/slot-config.d.ts
declare module 'slot-config' {
    interface PrizeWithLimit {
        name: string;
        prize_limit: number;
    }
  
    interface SpecificCombination {
      combination: string;
      prizes: PrizeWithLimit[];
    }

    interface ThemeConfig {
      gameTitle: string;
      titleColor: string;
      reelBorder: string;
      buttonBackgroundColor: string;
      buttonTextColor: string;
    }
  
    export interface SlotConfigAttributes {
      id?: number;
      slots: number;
      section: number;
      user_daily_limit: number;
      total_prize_limit: number;
      specific_combinations?: SpecificCombination[];
      theme_config?: ThemeConfig[];
      status: boolean;
      createdAt?: Date;
      updatedAt?: Date;
      deletedAt?: Date;
    }
  
    export interface SlotImageAttributes {
      id?: number;
      slot_config_id: number;
      image_name: string;
      image_path: string;
      section_number: number | null;
      createdAt?: Date;
      updatedAt?: Date;
      deletedAt?: Date;
    }

    export interface RewardHistoryAttributes {
      id?: number;
      prize: string;
      cust_id: number;
      createdAt?: Date;
      updatedAt?: Date;
    }
  
    // Form data interface
    export interface SlotConfigFormData {
      slots: string;
      section: string;
      user_daily_limit: string;
      total_prize_limit: string;
      specific_combinations?: string;  // JSON string
      theme_config?: string;  // JSON string
      status?: string;
    }

    export interface SpinHistoryAttributes {
      id?: number;
      user_name: string;
      user_number: string;
      result: SpinResult;
      prize_name?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
      deletedAt?: Date;
    }
  
    export type SpinResult = 'win' | 'loss';
  
    export interface SpinRequest {
      user_name: string;
      user_number: string;
    }
  
    export interface SpinResponseData {
      eligible: boolean;
      result?: SpinResult;
      prize?: {
        prize_name: string;
      };
      combination?: string;
    }

    export interface DailyLimitCheck {
      eligible: boolean;
    }

    export interface AuthenticatedSpinRequest {
      user_name: string;
      user_number: string;
      isAuthenticated: boolean;
    }
    
    export interface OtpVerificationRequest {
      user_name: string;
      user_number: string;
      otp: string;
    }
}