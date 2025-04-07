declare module 'memory-game' {
  export interface RewardTiersInterface {
    grandmaster: string;
    expert: string;
    skilled: string;
    beginner: string;
    novice: string;
    better_luck_next_time: string;
  }

  export interface GameThemeInterface {
    text_color: string;
    button_text_color: string;
    button_background_color: string;
  }

  export interface InitialGameConfig {
    game_time: number;
    total_cards: number;
    game_theme?: GameThemeInterface;
    background_image?: string | null;
    card_cover_image: string;
    card_front_images: string[];
  }

  export interface ConfigRequestBody {
    game_time: string;
    total_cards: string;
    rewards: string;
    game_theme?: string;
    daily_limit: string;
    isBackgroundImageRemoved: string;
  }

  export interface MemoryGameAttributes {
    id?: number;
    game_time: number;
    total_cards: number;
    daily_limit: number;
    background_image?: string | null;
    card_cover_image: string;
    card_front_images: string[];
    game_theme?: GameThemeInterface;
    rewards: RewardTiersInterface;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
}
