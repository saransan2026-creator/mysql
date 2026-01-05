import {z} from "zod";
import { Regex } from "./Regex";

  export const RegisterSchema = z.object({
    email: z.string().regex(Regex.EMAIL,{
        message: "Invalid email format"
    }),
    password: z.string().regex(Regex.PASSWORD,{
        message:"Password must be at least 6 characters long and contain at least one letter and one number"
    }),
        name: z.string().min(1,{
        message: "Name is required"
    }),
    phone:z.string().regex(Regex.PHONE_NUMBER,{
        message: "Invalid phone number format"
    }),
    location: z.string().min(1,{
        message: "Location is required"
    })
})

export const LoginSchema = z.object({
    email: z.string().regex(Regex.EMAIL,{
        message: "Invalid email"
    }),
    password: z.string().min(1,{
        message: "Password is required"
    })
})
export const UpdateProfileSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required"
    }),
    phone:z.string().regex(Regex.PHONE_NUMBER,{
        message: "Invalid phone number format"
    }),
    location: z.string().min(1,{
        message: "Location is required"
    })
})
