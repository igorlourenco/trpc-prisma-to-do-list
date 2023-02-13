import { z } from "zod";
import { getDate } from "../../utils/helpers";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  dueDate: z
    .string({
      required_error: "Due date is required",
    })
    .transform((str) => new Date(str).toISOString()),
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
      title: z.string(),
      description: z.string(),
      dueDate: z.date(),
      status: z.enum(["TO_DO", "DOING", "DONE"]),
    })
    .partial(),
});

export const filterQuery = z.object({
  userId: z.string(),
  dueDate: z
    .string()
    .transform((str) => new Date(str).toISOString())
    .nullable()
    .default(getDate()),
});

export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>;
export type UpdateTaskInput = z.TypeOf<typeof updateTaskSchema>;
