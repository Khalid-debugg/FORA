import { z } from "zod";
export const SignupValidation = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Too short" })
      .max(15, { message: "That's too much, maximum 15 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Too short" })
      .max(15, { message: "That's too much, maximum 15 characters" })
      .or(z.literal("")),
    username: z
      .string()
      .min(2, { message: "Too short" })
      .max(15, { message: "That's too much, maximum 15 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username can only contain letters, numbers, and underscores (no spaces allowed)",
      }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Too short" }),
    confirmPassword: z.string(),
    governorate: z.string().nonempty("Governorate is required"),
    city: z.string(),
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
export const ResetPasswordValidation = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});
export const SetNewPasswordValidation = z
  .object({
    password: z.string().min(6, { message: "Too short" }),
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
export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(20, { message: "Name must not exceed 20 characters." }),
  bio: z
    .string()
    .max(220, { message: "Bio must not exceed 160 characters." })
    .optional(),
  tags: z
    .array(z.string())
    .max(10, { message: "You can only add up to 10 tags." })
    .optional(),
  favPosition: z.string().optional(),
  FifaCard: z.string().optional(),
});
export const messageValidation = z.object({
  content: z
    .string()
    .nonempty("text is required")
    .max(2200, { message: "That's too much, maximum 2200 characters" }),
  media: z.custom<File>(),
});
