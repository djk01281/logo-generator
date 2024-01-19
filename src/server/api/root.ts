import { createTRPCRouter } from "./trpc";
import { generateRouter } from "./routers/generate";
import { convertRouter } from "./routers/convert";
import { registerRouter } from "./routers/register";
import { userRouter } from "./routers/user";
import { historyRouter } from "./routers/history";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  generate: generateRouter,
  convert: convertRouter,
  register: registerRouter,
  user: userRouter,
  history: historyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
