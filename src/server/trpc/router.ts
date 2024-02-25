import { t } from './context';
import { router as assets } from './router/assets';

export const router = t.router({
	assets
});

export type Router = typeof router;
