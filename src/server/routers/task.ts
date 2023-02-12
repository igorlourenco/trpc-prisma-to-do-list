import {
  createTaskController,
  deleteTaskController,
  findAllTasksController,
  findTaskController,
  updateTaskController,
} from "../controllers/task";
import {
  createTaskSchema,
  filterQuery,
  params,
  updateTaskSchema,
} from "../schema/task";
import { procedure, router } from "../trpc";

export const taskRouter = router({
  getTasksByUserId: procedure.input(filterQuery).query(({ input }) => {
    return findAllTasksController({ filterQuery: input });
  }),
  getTask: procedure.input(params).query(({ input }) => {
    return findTaskController({ paramsInput: input });
  }),
  createTask: procedure.input(createTaskSchema).mutation(({ input }) => {
    return createTaskController({ input });
  }),
  updateTask: procedure.input(updateTaskSchema).mutation(({ input }) => {
    return updateTaskController({
      paramsInput: { taskId: input.params.taskId },
      input: input.body,
    });
  }),

  deleteTask: procedure.input(params).mutation(({ input }) => {
    return deleteTaskController({ paramsInput: input });
  }),
});
