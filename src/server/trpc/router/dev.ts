import { generateId } from '$server/utils';
import { t } from '../context';

const reset = t.procedure.query(async ({ ctx }) => {
  const server = ctx.server;

  await Promise.all([
    server.collections.assets.clear(),
    server.collections.workspaceNodes.clear(),
    server.collections.workspaces.clear()
  ]);

  const workspaceId = generateId();

  await server.collections.workspaces.set(workspaceId, {
    identifier: 'default'
  });

  const boxes = [
    { position: { x: 3, y: 3 }, size: { width: 8, height: 8 }, color: 'red' },
    { position: { x: 30, y: 10 }, size: { width: 8, height: 8 }, color: 'green' }
  ];

  await Promise.all(
    boxes.map(async (box, idx) => {
      const assetId = generateId();
      await server.collections.assets.set(assetId, {
        type: 'box',
        identifier: `box-${idx}`,
        size: box.size,
        color: box.color
      });
      await server.collections.workspaceNodes.set(generateId(), {
        asset: assetId,
        position: box.position
      });
    })
  );
});

export const router = t.router({
  reset
});
