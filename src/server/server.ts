import type { Handle } from "@sveltejs/kit";
import { Collection } from "./collection";
import { dirname } from "./utils";
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
}

export class Server {
  collections: Collections;

  constructor() {
    this.collections = new Collections();
  }
}

export const server: Handle = ({ event, resolve }) => {
  event.locals.server = new Server();
  return resolve(event);
};
