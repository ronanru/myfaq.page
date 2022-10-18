import { router } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';
import { questionRouter } from './question';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  question: questionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
