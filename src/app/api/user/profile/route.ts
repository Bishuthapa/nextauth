import {connect} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import {getDataFromToken} from   "@/src/utils/getDataFromToken"

connect();

export async function GET(req : NextRequest){



    //extract token from cookie

    const userId = await getDataFromToken(req);

        const user = User.findOne({_id : userId}).select("-password")


        return NextResponse.json({
            message: "User found",
            data :user
        })
    }