import { procedure, router } from "../trpc";
import { helloRouter } from "./hello";
import { taskRouter } from "./task";

export const appRouter = router({
  healthCheck: procedure.query(() => "yay!"),
  hello: helloRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
