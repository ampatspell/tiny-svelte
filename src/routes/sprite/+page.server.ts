import type { ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = async (event) => {
  const { locals: { server } } = event;

  await server.collections.sprites.set('default', {
    name: 'Default',
    size: {
      width: 8,
      height: 8
    },
    pixels: Array(8*8).fill(0)
  });

  const sprite = await server.collections.sprites.get('default');
  return {
    sprite
  };
}
