import {type Document} from "mongoose"


export interface  Iuser extends Document{
    username : string,
    email: string,
    password: string,
    avatar?: string,
    isVerified : boolean,
    isAdmine: boolean,
    forgetPasswordToken: string,
    forgetPasswordTokenExpiry: Date,
    verifyToken: string,
    verifyTokenExpiry: Date,
}

export interface SendEmailParams {
  email: string;
  emailType: "verify" | "reset";
  userId: string;
}