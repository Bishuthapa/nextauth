import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/src/validators/loginSchema";
import { loginRateLimit, emailLoginRateLimit } from "@/src/utils/rateLimit";
import { getIpAddress } from "@/src/utils/getRateLimitIdentifier";

connect();
/**
 * email & password
 * find the user through the email
 * compare the save password and the user enter password
 *  
 */


export async function POST(req: NextRequest) {
  try {

    const ip = getIpAddress(req);

    const ipRateLimit = await loginRateLimit.limit(ip);


    if (!ipRateLimit.success) {

      const resetTime = new Date(ipRateLimit.reset);
      const waitMinutes = Math.ceil((ipRateLimit.reset - Date.now()) / 60000);


      return NextResponse.json({
        success: false,
        message: `Too many login attempts from this IP. Please try again in ${waitMinutes} minute(s).`,
        retryAfter: Math.floor((ipRateLimit.reset - Date.now()) / 1000),
      },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": ipRateLimit.limit.toString(),
            "X-RateLimit-Remaining": ipRateLimit.remaining.toString(),
            "X-RateLimit-Reset": resetTime.toISOString(),
            "Retry-After": Math.floor((ipRateLimit.reset - Date.now()) / 1000).toString(),
          },
        });
    }



    const body = await req.json();

    //  Zod validation
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const emailRateLimit = await emailLoginRateLimit.limit(
      `email:${email.toLowerCase()}`
    );

    if (!emailRateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts for this account. Please try again later.",
        },
        { status: 429 }
      );
    }

    // ✅ 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // ✅ 3. Compare password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }


    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET not configured");
    }



    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' }) //add ! to the tokenSecret to ensure the value is available from .evn




    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
      data: { username: user.username,
        email: user.email,
       }
    },
      {
        status: 200
      })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    }
    )

    return response;
  }
  catch (error: unknown) {
    console.error("Login error", error);
    return NextResponse.json({
      success: false,
      message: "An error occure during login"
    },
      {
        status: 500
      });
  }
}