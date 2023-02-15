import { Task } from "@prisma/client";
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
  getTasksByUserId: procedure.input(filterQuery).query(async ({ input }) => {
    const statusOrder = {
      DOING: 0,
      TO_DO: 1,
      DONE: 2,
    };

    const tasks = await findAllTasksController({ filterQuery: input });

    tasks.tasks.sort((a: Task, b: Task) =>
      statusOrder[a.status] > statusOrder[b.status] ? 1 : -1
    );

    return tasks;
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
