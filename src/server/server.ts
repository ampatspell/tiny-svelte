import type { Handle } from "@sveltejs/kit";
import { Collection } from "./collection";
import type { SpriteData } from "$lib/types";
import { dirname } from "./utils";
import path from "path";

export class Collections {
  sprites: Collection<SpriteData>;

  constructor() {
    const base = path.join(dirname(import.meta.url), 'collections');
    this.sprites = new Collection({ base, name: 'sprites' });
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