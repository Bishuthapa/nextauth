import { Iuser } from "@/types/index";
import mongoose from "mongoose";

const userSchema: mongoose.Schema<Iuser, mongoose.Model<Iuser>> = new mongoose.Schema({
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

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User

