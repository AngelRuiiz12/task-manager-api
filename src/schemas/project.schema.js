import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string(),
  userId: z.number(),
});

export const updateProjectSchema = createProjectSchema.partial();
