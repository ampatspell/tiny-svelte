import { t } from '../context';
import { AssetDataSchema, IdSchema } from '$lib/types';
import { generateId } from '$server/utils';
import { z } from 'zod';

const index = t.procedure.query(async ({ ctx }) => {
	const index = await ctx.server.collections.assets.index();
	return { index };
});

const get = t.procedure.input(IdSchema).query(async ({ input, ctx }) => {
	const asset = await ctx.server.collections.assets.get(input.id);
	return { asset };
});

const create = t.procedure.input(AssetDataSchema).query(async ({ input, ctx }) => {
	const id = generateId();
	await ctx.server.collections.assets.set(id, input);
	return { id };
});

const UpdateSchema = z.object({
	id: z.string().trim(),
	data: AssetDataSchema
});

const update = t.procedure.input(UpdateSchema).query(async ({ input, ctx }) => {
	await ctx.server.collections.assets.set(input.id, input.data);
});

const destroy = t.procedure.input(IdSchema).query(async ({ input, ctx }) => {
	await ctx.server.collections.assets.delete(input.id);
});

export const router = t.router({
	index,
	get,
	create,
	update,
	destroy
});
