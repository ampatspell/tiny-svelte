import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { router } from './router';
import { createContext } from './context';

export const trpc: Handle = createTRPCHandle({ router, createContext });
