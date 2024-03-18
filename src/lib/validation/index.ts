import { z } from "zod";
export const SignupValidation = z
  .object({
    username: z
      .string()
      .min(2, { message: "Too short" })
      .max(15, { message: "That's too much, maximum 15 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Too short" }),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );
export const SigninValidation = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string(),
});
