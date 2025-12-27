export interface  Iuser {
    username : string,
    email: string,
    password: string,
    isVerified : boolean,
    isAdmine: boolean,
    forgetPasswordToken: string,
    forgetPasswordTokenExpiry: Date,
    verifyToken: string,
    verifyTokenExpiry: Date,
}