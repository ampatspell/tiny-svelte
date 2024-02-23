export const actions = {
	delete: async (event) => {
		const id = event.params.id;
		await event.locals.server.collections.assets.delete(id);
	}
};
