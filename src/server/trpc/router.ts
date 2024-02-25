import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { AssetDataSchema, IdSchema } from '$lib/types';
import { generateId } from '$server/utils';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	assets: t.router({
		create: t.procedure.input(AssetDataSchema).query(async ({ input, ctx }) => {
			const id = generateId();
			await ctx.server.collections.assets.set(id, input);
			return { id };
		}),
		update: t.procedure
			.input(
				z.object({
					id: z.string(),
					data: AssetDataSchema
				})
			)
			.query(async ({ input, ctx }) => {
				await ctx.server.collections.assets.set(input.id, input.data);
			}),
		delete: t.procedure.input(IdSchema).query(async ({ input, ctx }) => {
			await ctx.server.collections.assets.delete(input.id);
		})
	})
});

export type Router = typeof router;
