import { server } from '$server/server';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(server);
