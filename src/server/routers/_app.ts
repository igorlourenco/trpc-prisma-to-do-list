import { procedure, router } from "../trpc";
import { helloRouter } from "./hello";

export const appRouter = router({
  healthCheck: procedure.query(() => "yay!"),
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
