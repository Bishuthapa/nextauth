import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

connect();


export async function POST(req: NextRequest) {

    try {

        const reqBody = await req.json();
        const { token } = reqBody;

        if (!token) {
            throw new ApiError(400, "token not found");
        }

        const user = await User.findOne({verifyToken: token,
            verifyTokenExpiry : {$gt : Date.now()}
        });

        if(!user){
             return NextResponse.json(
            {
                error: "Invalid token detail"
            },
            {
                status: 400
            }
        )
        }

        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        const saveUser = await user.save();
        console.log(saveUser);


         return NextResponse.json(
            {
                message: "email verified successfully",
                success : true
            },
            {
                status: 200
            }
        )




    }
    catch (error: unknown)
    {
        console.log(error);
        return NextResponse.json(
            {
                error: error as string
            },
            {
                status: 500
            }
        )
    }



}