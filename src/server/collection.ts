import path from 'path';
import fs from 'fs/promises';

export type CollectionOptions = {
  base: string;
  name: string;
}

export type CollectionDocument<T extends object> = {
  id: string;
  data: T;
}

export class Collection<T extends object> {
  options: CollectionOptions;

  constructor(options: CollectionOptions) {
    this.options = options;
  }

  async prepare(): Promise<void> {
    await fs.mkdir(this.path, { recursive: true });
  }

  get path() {
    return path.join(this.options.base, this.options.name);
  }

  pathForId(id: string) {
    return path.join(this.path, `${id}.json`);
  }

  async get(id: string): Promise<CollectionDocument<T>> {
    const string = await fs.readFile(this.pathForId(id), 'utf-8');
    const data = JSON.parse(string);
    return {
      id,
      data
    };
  }

  async set(id: string, data: T) {
    const string = JSON.stringify(data, null, 2);
    await fs.writeFile(this.pathForId(id), string, 'utf-8');
  }

}
