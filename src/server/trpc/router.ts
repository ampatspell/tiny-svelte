import { t } from './context';
import { router as assets } from './router/assets';
import { router as dev } from './router/dev';

export const router = t.router({
  dev,
  assets
});

export type Router = typeof router;
