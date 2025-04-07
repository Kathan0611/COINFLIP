declare module 'coin-flip' {
    //price interface
    export interface PricesAttributesInterface {
       limit: number;
       price: text;
    }
     // specialday field interface
    export interface SpecialDaysAttributesInterface {
       date: Date;
       start_date: Date;
       end_date: Date;
       daily_limit: number;
       price:text;
    }
    // CoinFlip interface
    export interface CoinflipAttributesInterface {
        id:number;
        head_image: string;
        tail_image: string;
        special_days: SpecialDaysAttributesInterface[];
        prices: PricesAttributesInterface[];
        daily_limit:number;
        createdAt?: Date;
        updatedAt?: Date;
  
    }
  
     //FilpRequest interface
    export interface FlipRequest {
     name: string;
     mobileNumber: string;
     predictionValue: "head" | "tail";
   }
   
   //FileResponse interface
   export interface FlipResponse {
     flipResult: "head" | "tail";
     isWinner: boolean;
     price: text;
     priceDetails?: PriceDetails;
     message: string;
     isSpecialDay: boolean;
   }
  
    //coinFlipRecord
   export interface CoinFlipRecord {
     id:number
     user_name:string,
     mobile_number:string,
     prediction_value: "head" | "tail";
     flip_result: "head" | "tail";
     is_winner: boolean;
     price:text;
     message: string;
     is_special_day: boolean;
     createdAt?: Date;
     updatedAt?: Date;
     deletedAt?:Date;
   }
  }
  