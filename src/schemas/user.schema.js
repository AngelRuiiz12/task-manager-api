import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string(),
});

export const updateUserSchema = createUserSchema.partial();
