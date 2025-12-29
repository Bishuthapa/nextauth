import {connect} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();
/**
 * email & password
 * find the user through the email
 * compare the save password and the user enter password
 *  
 */


export async function POST(req : NextRequest){
    try{

        const reqBody = await req.json();

        const { email, password} = reqBody;

        console.log(reqBody);


        const user = await User.findOne({email});


        if(!user){
            throw new ApiError(404, "User does not exit");
        }
        

        const validPassword = await bcryptjs.compare(password, user.password);

        if(!validPassword){
            throw new ApiError(404, "Check your credientials");
        }


        const tokenData = {
            id: user._id,
            username : user.username,
            email: user.email
        }

        

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d' }) //add ! to the tokenSecret to ensure the value is available from .evn




        const response =  NextResponse.json({
            message : "User logged in successfully",
            success: true
        })

        response.cookies.set("token", token,{
            httpOnly: true
        }
        )

        return response;

        




    }
    catch(error: unknown){
        return NextResponse.json({
            error : error as string
        },
    {
        status: 500
    })
    }
}