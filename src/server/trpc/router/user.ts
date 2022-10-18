import { router, protectedProcedure } from '../trpc';
import z from 'zod';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  getSettings: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        username: true,
        image: true,
        isBoxed: true,
        isNumbered: true,
        name: true,
        theme: true
      }
    })
  ),
  setSettings: protectedProcedure
    .input(
      z
        .object({
          isBoxed: z.boolean(),
          isNumbered: z.boolean(),
          theme: z.number().int().nonnegative().max(5)
        })
        .strict()
    )
    .mutation(({ ctx, input }) =>
      ctx.prisma.user
        .update({
          data: input,
          where: {
            id: ctx.session.user.id
          },
          select: {
            username: true
          }
        })
        .then(({ username }) => ctx.revalidate(`/${username}`))
    ),
  setUsername: protectedProcedure
    .input(z.string().regex(/[a-z0-9_]{4,16}/))
    .mutation(async ({ ctx, input }) => {
      const [user, userWithThisUsername] = await Promise.all([
        ctx.prisma.user.findUniqueOrThrow({
          where: {
            id: ctx.session.user.id
          },
          select: {
            username: true
          }
        }),
        ctx.prisma.user.findUnique({ where: { username: input } })
      ]);
      if (user.username === input)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This is the same url you already have'
        });
      if (userWithThisUsername)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This url is already taken'
        });
      return ctx.prisma.user
        .update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            username: input
          }
        })
        .then(() =>
          Promise.all([
            ctx.revalidate(`/${input}`),
            user.username ? ctx.revalidate(`/${user.username}`) : Promise.resolve()
          ])
        );
    }),
  setName: protectedProcedure.input(z.string().min(1).max(32)).mutation(({ ctx, input }) =>
    ctx.prisma.user
      .update({
        where: { id: ctx.session.user.id },
        data: { name: input },
        select: { username: true }
      })
      .then(({ username }) => ctx.revalidate(`/${username}`))
  )
});
