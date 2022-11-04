import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  }
});

export const router = t.router,
  publicProcedure = t.procedure,
  protectedProcedure = t.procedure.use(
    t.middleware(({ ctx, next }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return next({
        ctx: {
          // infers the `session` as non-nullable
          session: { ...ctx.session, user: ctx.session.user }
        }
      });
    })
  );
