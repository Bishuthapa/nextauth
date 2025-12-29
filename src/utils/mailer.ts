import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "@/src/models/user.model";
import { SendEmailParams } from "@/types";


export const sendEmail = async ({
    email,
    emailType,
    userId,
}: SendEmailParams) => {
    try {
        // 1️⃣ Generate raw token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // 2️⃣ Hash token for DB
        const hashedToken = await bcryptjs.hash(rawToken, 10);

        // 3️⃣ Save token in DB
        if (emailType === "verify") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                forgetPasswordToken: hashedToken,
                forgetPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        // 4️⃣ Mailtrap config
        if (!process.env.MAILTRAP_TOKEN) {
            throw new Error("MAILTRAP_API_KEY not defined");
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!,
            },
        });


        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const link =
            emailType === "verify"
                ? `${baseUrl}/verifyemail?token=${rawToken}`
                : `${baseUrl}/reset-password?token=${rawToken}`;

        // 6️⃣ Send email
        const info = await transport.sendMail({
            from: '"Auth Team" <no-reply@yourapp.com>',
            to: email,
            subject:
                emailType === "verify"
                    ? "Verify your email"
                    : "Reset your password",
            html: `
            <p>Click the link below to ${emailType === "verify" ? "verify your email" : "reset your password"
                }:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 1 hour.</p>
      `,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Email error:", error);
    }
};
