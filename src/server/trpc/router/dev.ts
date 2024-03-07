import { t } from '../context';

const reset = t.procedure.query(async ({ ctx }) => {
  const server = ctx.server;

  await Promise.all([
    server.collections.assets.clear(),
    server.collections.workspaceNodes.clear(),
    server.collections.workspaces.clear()
  ]);
});

export const router = t.router({
  reset
});
