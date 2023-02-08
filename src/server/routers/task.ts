import { z } from "zod";
import {
	createTaskController,
	deleteTaskController,
	findAllTasksController,
	findTaskController,
	updateTaskController
} from "../controllers/task";
import { procedure, router } from "../trpc";

export const taskRouter = router({
  getTasksByUserId: procedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().default(10).nullable(),
        page: z.number().default(1).nullable(),
      })
    )
    .query(({ input }) => {
      return findAllTasksController({ filterQuery: input });
    }),
  getTask: procedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .query(({ input }) => {
      return findTaskController({ paramsInput: input });
    }),
  createTask: procedure
    .input(
      z.object({
        userId: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ input }) => {
      return createTaskController({ input });
    }),
  updateTask: procedure
    .input(
      z.object({
        userId: z.string(),
        text: z.string(),
        taskId: z.string(),
      })
    )
    .mutation(({ input }) => {
      const { taskId, ...rest } = input;
      return updateTaskController({
        paramsInput: { taskId },
        input: { ...rest },
      });
    }),

  deleteTask: procedure
    .input(z.object({ taskId: z.string() }))
    .mutation(({ input }) => {
      return deleteTaskController({ paramsInput: input });
    }),
});
