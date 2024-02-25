import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { AssetDataSchema } from '$lib/types';
import { generateId } from '$server/utils';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	assets: t.router({
		all: t.procedure.query(async ({ ctx }) => {
			const assets = await ctx.server.collections.assets.index();
			return {
				assets
			};
		}),
		create: t.procedure.input(AssetDataSchema).query(async ({ input, ctx }) => {
			const id = generateId();
			await ctx.server.collections.assets.set(id, input);
			return { id };
		})
	})
});

export type Router = typeof router;
