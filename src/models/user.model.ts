
import { verify } from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmine: {
        type: Boolean,
        default: false
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
});

const User = mongoose.model("User", userSchema);

export default User

