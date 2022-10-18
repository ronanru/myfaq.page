import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import z from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const questionRouter = router({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.question.findMany({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        id: true,
        index: true,
        text: true
      },
      orderBy: {
        index: 'asc'
      }
    })
  ),
  get: protectedProcedure.input(z.string().cuid()).query(({ ctx, input }) =>
    ctx.prisma.question.findFirst({
      where: {
        id: input,
        userId: ctx.session.user.id
      },
      select: {
        answer: true,
        text: true
      }
    })
  ),
  add: protectedProcedure.mutation(async ({ ctx }) => {
    const count = await ctx.prisma.question.count({ where: { userId: ctx.session.user.id } });
    if (count >= 50)
      throw new TRPCError({ code: 'BAD_REQUEST', message: "You can't create any more questions" });

    return ctx.prisma.question
      .create({
        data: {
          answer: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'EDIT ME' }] }]
          },
          text: 'New Question',
          index: count,
          user: {
            connect: {
              id: ctx.session.user.id
            }
          }
        },
        select: {
          user: {
            select: {
              username: true
            }
          }
        }
      })
      .then(({ user }) => ctx.revalidate(`/${user.username}`));
  }),
  setIndex: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          newIndex: z.number().int().nonnegative()
        })
        .strict()
    )
    .mutation(async ({ ctx, input: { newIndex, id } }) => {
      const count = await ctx.prisma.question.count({ where: { userId: ctx.session.user.id } }),
        { index: oldIndex, user } = await ctx.prisma.question.findFirstOrThrow({
          where: {
            id,
            userId: ctx.session.user.id
          },
          select: {
            index: true,
            user: {
              select: {
                username: true
              }
            }
          }
        });
      if (oldIndex >= count || newIndex >= count || newIndex === oldIndex)
        throw new TRPCError({ code: 'BAD_REQUEST' });
      return ctx.prisma
        .$transaction([
          ctx.prisma.question.updateMany({
            where: {
              index:
                oldIndex > newIndex
                  ? {
                      gte: newIndex,
                      lt: oldIndex
                    }
                  : {
                      gt: oldIndex,
                      lte: newIndex
                    },
              userId: ctx.session.user.id
            },
            data: {
              index: {
                [oldIndex > newIndex ? 'increment' : 'decrement']: 1
              }
            }
          }),
          ctx.prisma.question.update({
            where: { id },
            data: {
              index: newIndex
            }
          })
        ])
        .then(() => ctx.revalidate(`/${user.username}`));
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          text: z.string().min(3).max(100),
          answer: jsonSchema
        })
        .strict()
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: ctx.session.user.id
        },
        select: {
          username: true
        }
      });
      return ctx.prisma.question
        .updateMany({
          where: { id: input.id, userId: ctx.session.user.id },
          data: {
            answer: input.answer as Record<string, never>,
            text: input.text
          }
        })
        .then(() => ctx.revalidate(`/${user.username}`));
    }),
  delete: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id
      },
      select: {
        username: true
      }
    });
    await ctx.prisma.question
      .deleteMany({
        where: {
          id: input,
          userId: ctx.session.user.id
        }
      })
      .then(() => ctx.revalidate(`/${user.username}`));
  })
});
