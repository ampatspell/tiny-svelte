import type { Handle } from "@sveltejs/kit";
import { Collection } from "./collection";
import { dirname, once } from "./utils";
import path from "path";
import type { AssetData, AssetIndex } from "$lib/types";

export class Collections {
  assets: Collection<AssetData, AssetIndex>;

  constructor() {
    const base = path.join(dirname(import.meta.url), 'collections');
    this.assets = new Collection({
      base,
      name: 'assets',
      index: ({ parent, type, identifier }: AssetData) => ({
        parent,
        type,
        identifier
      }),
    });
  }

  async prepare() {
    await this.assets.prepare();
  }
}

export class Server {
  collections: Collections;

  constructor() {
    this.collections = new Collections();
  }

  async prepare() {
    await this.collections.prepare();
  }
}

const createServer = async () => {
  const server = new Server();
  await once('create-server', () => server.prepare());
  return server;
}

export const server: Handle = async ({ event, resolve }) => {
  event.locals.server = await createServer();
  return resolve(event);
};
