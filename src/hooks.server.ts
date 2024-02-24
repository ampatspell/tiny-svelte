import { server } from '$server/server';
import { sequence } from '@sveltejs/kit/hooks';
import { trpc } from '$server/trpc/hook';

export const handle = sequence(server, trpc);
