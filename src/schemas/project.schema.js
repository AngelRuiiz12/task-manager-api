import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string(),
});

export const updateProjectSchema = createProjectSchema.partial();
