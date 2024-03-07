import type { RequestEvent } from '@sveltejs/kit';
import { initTRPC, type inferAsyncReturnType } from '@trpc/server';

export async function createContext(event: RequestEvent) {
  const server = event.locals.server;
  return {
    server
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();
