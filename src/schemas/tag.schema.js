import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string(),
});

export const updateTagSchema = createTagSchema.partial();
