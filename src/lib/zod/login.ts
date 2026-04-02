import { email, object, string } from "zod";

export const loginSchema = object({
  email: email(),
  password: string(),
});
