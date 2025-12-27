import nodemailer from "nodemailer";

interface SendEmailParams {
    email: string;
    emailType: "verify" | "reset";
    userId: string;
}


//using nodemailer

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use true for port 465, false for port 587
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        // Send an email using async/await
        (async () => {
            const info = await transporter.sendMail({
                from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                to: email,
                subject: emailType === "verify" ? "Verify your email" : "Reset your password",
                html: "<b>Hello world?</b>", // HTML version of the message
            });

            console.log("Message sent:", info.messageId);
        })();


    }

    catch (error) {
        console.log(error)
    }
}