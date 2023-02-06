import { z } from "zod";
import { procedure, router } from "../trpc";

export const helloRouter = router({
  get: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.name}`,
      };
    }),
});
