import { z } from "zod";

export const createTaskSchema = z.object({
  text: z.string({
    required_error: "Text is required",
  }),
  userId: z.string({
    required_error: "User ID is required",
  }),
});

export const params = z.object({
  taskId: z.string(),
});

export const updateTaskSchema = z.object({
  params,
  body: z
    .object({
      text: z.string(),
    })
    .partial(),
});

export const filterQuery = z.object({
  limit: z.number().default(1).nullable(),
  page: z.number().default(10).nullable(),
  userId: z.string(),
});

export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>;
export type UpdateTaskInput = z.TypeOf<typeof updateTaskSchema>;
