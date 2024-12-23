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
export const gameValidation = z.object({
  caption: z
    .string()
    .max(2200, { message: "That's too much, maximum 2200 characters" }),
  playersNumber: z.coerce.number().min(1).max(22),
  governorate: z.string().nonempty("Governorate is required"),
  city: z.string(),
  playgroundName: z
    .string()
    .max(30, { message: "That's too much, maximum 30 characters" })
    .nonempty("Playground name is required"),
  dateTime: z.string().nonempty("Date and time is required"),
});
export const postValidation = z.object({
  caption: z
    .string()
    .nonempty("Caption is required")
    .max(2200, { message: "That's too much, maximum 2200 characters" }),
  file: z.custom<File[]>(),
});
export const commentValidation = z.object({
  comment: z
    .string()
    .nonempty("text is required")
    .max(2200, { message: "That's too much, maximum 2200 characters" }),
  media: z.custom<File>(),
});
export const replyValidation = z.object({
  reply: z
    .string()
    .nonempty("text is required")
    .max(2200, { message: "That's too much, maximum 2200 characters" }),
  media: z.custom<File>(),
});
