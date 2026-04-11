import { email, object, string } from "zod";

export const loginSchema = object({
  email: string().min(1, "User ID is required"),
  password: string().min(1, "Password is required"),
});
