import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "DONE"])
    .optional()
    .default("PENDING"),
  projectId: z.number(),
});
