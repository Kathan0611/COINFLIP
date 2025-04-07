declare module 'otp' {
  export interface OtpInterface {
    id: number;
    mobile_number: string;
    otp: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}
