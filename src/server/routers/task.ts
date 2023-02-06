import { z } from "zod";
import {
  createTaskController,
  deleteTaskController,
  findAllTasksController,
  findTaskController,
  updateTaskController,
} from "../controllers/task";
import { procedure, router } from "../trpc";

export const helloRouter = router({
  getTasksByUserId: procedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number(),
        page: z.number(),
      })
    )
    .query(({ input }) => {
      findAllTasksController({ filterQuery: input });
    }),
  getTask: procedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .query(({ input }) => {
      findTaskController({ paramsInput: input });
    }),
  createTask: procedure
    .input(
      z.object({
        userId: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ input }) => {
      createTaskController({ input });
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
      updateTaskController({
        paramsInput: { taskId },
        input: { ...rest },
      });
    }),

  deleteTask: procedure
    .input(z.object({ taskId: z.string() }))
    .mutation(({ input }) => deleteTaskController({ paramsInput: input })),
});
