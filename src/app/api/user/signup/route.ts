import {connect} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/src/utils/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();


export async function POST(req: NextRequest){

    try {

        const reqBody = await req.json();

        const {username, email, password} = reqBody;

        console.log(reqBody);


        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({
                error: "User already exists."
            },
        {
            status: 400
        })
        }


        const salt = await bcryptjs.genSalt(10);

        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const saveUser = await newUser.save();
        console.log(saveUser);

        //send veriication email


        await sendEmail({
            email,
            emailType: "verify",
            userId: saveUser._id
        })

        return NextResponse.json({
            message: "User created successfully",
            success : true,
            saveUser
        })



    }
    catch(error){
        return NextResponse.json(
            {
                error: error
            },
            {
                status: 500
            }
        )
    }


}