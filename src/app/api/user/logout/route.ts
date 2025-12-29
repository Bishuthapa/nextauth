import {connect} from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();


export async function GET(req : NextRequest){
    try {

        const response =  NextResponse.json({
            message: "Logout Successfully",
            success : true
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        },
        )

        return response;
    

    }
    catch(error : unknown){
        return NextResponse.json(
            {
                error : error as string
            },
            {
                status : 500
            }
        )
    }
}