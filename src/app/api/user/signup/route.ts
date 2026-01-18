import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/user.model";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/src/utils/mailer";
import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/src/validators/signupSchema";
import { signupRateLimit } from "@/src/utils/rateLimit";
import { getIpAddress } from "@/src/utils/getRateLimitIdentifier";

connect();


export async function POST(req: NextRequest) {

    try {

        const ip = getIpAddress(req);

        const { success, limit, remaining, reset } = await signupRateLimit.limit(ip);
        if (!success) {
            const resetTime = new Date(reset);
            const waitMinutes = Math.ceil((reset - Date.now()) / 60000);

            return NextResponse.json({
                success: false,
                message: `Too many sighup attempts. Please try again in ${waitMinutes} minute(s).`,
                retryAfter: Math.floor((reset - Date.now()) / 1000),
            },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": resetTime.toISOString(),
                        "Retry-After": Math.floor((reset - Date.now()) / 1000).toString(),
                    }
                })
        }

        const reqBody = await req.json();

        //zod validation

        const result = signupSchema.safeParse(reqBody);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400
                }
            );
        }



        const { username, email, password } = result.data;

        console.log(reqBody);


        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: existingUser.email === email ? "Email is already registered" : "Username already taken"
            },
                {
                    status: 409
                });
        }



        const salt = await bcryptjs.genSalt(10);

        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const saveUser = await newUser.save();

        //send veriication email


        try {
            await sendEmail({
                email,
                emailType: "verify",
                userId: saveUser._id
            })
        } catch (emailError) {
            console.error("Email sending failed:", emailError)

        }

        return NextResponse.json({
            message: "Account created! Please check your email to verify.",
            success: true,
            data: {
                username: saveUser.username,
                email: saveUser.email
            }
        },
            {
                status: 201
            })



    }
    catch (error) {
        console.log("Signup error", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occured during registration"
            },
            {
                status: 500
            }
        )
    }


}