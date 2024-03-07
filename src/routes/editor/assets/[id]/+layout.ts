import { createTRPC } from '$lib/trpc/client.svelte';
import type { AssetData } from '$lib/types';
import type { LayoutLoad } from './$types';

class AssetRouteModel {
  trpc = createTRPC();
  id: string;
  data!: AssetData;

  constructor(id: string) {
    this.id = id;
  }

  async load() {
    const data = await this.trpc.assets.get.query({ id: this.id });
    this.data = data.asset.data;
  }

  async destroy() {
    await this.trpc.assets.destroy.query({ id: this.id });
  }
}

export const load: LayoutLoad = async (event) => {
  const {
    params: { id }
  } = event;

  const asset = new AssetRouteModel(id);
  await asset.load();

  return {
    asset
  };
};
