import { object, string } from "zod";

export const signupSchema = object({
  name: string().min(1, "Name is required"),
  email: string().min(1, "User ID / Email is required"),
  password: string().min(6, "Password must be at least 6 characters"),
});
