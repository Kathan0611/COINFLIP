declare module 'userotp' {
  export interface UserOtpInterface {
    id: number;
    phoneNumber: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }
}
