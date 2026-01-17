import { z } from "zod";


export const signupSchema = z.object(
    {
        username : z.string().min(3, "Username must be at least 3 characters"),
        email : z.string().email("Invalid email address"),
        password : z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword : z.string(),
    })
    .refine((data) => data.password == data.confirmPassword, {
        message : "Password do not match",
        path: ['confirmPassword'] //this help to give the error to the confirmPassword field
    })