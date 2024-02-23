import { json } from '@sveltejs/kit';

export async function DELETE(event) {
	const id = event.params.id;
	await event.locals.server.collections.assets.delete(id);
	return json({ ok: true });
}
