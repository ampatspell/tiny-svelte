import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  }),
  assets: t.procedure.input(z.object({ name: z.string() })).query(async (arg) => {
    const name = arg.input.name;
    const assets = await arg.ctx.server.collections.assets.index();
    return {
      name,
      assets
    };
  }),
});

export type Router = typeof router;
