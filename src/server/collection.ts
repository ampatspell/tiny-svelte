import path from 'path';
import fs from 'fs/promises';
import assert from 'assert';

interface NodeError extends Error {
	errno?: number;
	code?: string;
	path?: string;
	syscall?: string;
	stack?: string;
}

const isNodeError = (value: unknown): value is NodeError => {
	return value instanceof Error;
};

const read = async <T>(path: string, optional: boolean = false): Promise<T | undefined> => {
	try {
		const string = await fs.readFile(path, 'utf-8');
		return JSON.parse(string) as T;
	} catch (err: unknown) {
		if (isNodeError(err)) {
			if (err.code === 'ENOENT' && optional) {
				return undefined;
			}
			throw err;
		}
	}
};

const write = async <T>(
	path: string,
	data: T,
	beforeWrite?: () => Promise<void>
): Promise<void> => {
	const string = JSON.stringify(data, null, 2);
	await beforeWrite?.();
	await fs.writeFile(path, string, 'utf-8');
};

const del = async (path: string): Promise<void> => {
	try {
		await fs.rm(path);
	} catch (err: unknown) {
		if (isNodeError(err)) {
			if (err.code === 'ENOENT') {
				return;
			}
			throw err;
		}
	}
};

export type CollectionIndexFn<T, I> = (data: T) => I;

export type CollectionOptions<T extends object, I extends object> = {
	base: string;
	name: string;
	index: CollectionIndexFn<T, I>;
};

export type CollectionDocument<T extends object> = {
	id: string;
	data: T;
};

export type CollectionIndexData<I extends object> = {
	[id: string]: I;
};

export type CollectionIndexDocument<I extends object> = {
	id: string;
	data: I;
};

export class CollectionIndex<T extends object, I extends object> {
	collection: Collection<T, I>;

	constructor(collection: Collection<T, I>) {
		this.collection = collection;
	}

	get path() {
		return this.collection.pathForId('__index');
	}

	async read(optional: true): Promise<CollectionIndexData<I> | undefined>;
	async read(optional: false): Promise<CollectionIndexData<I>>;
	async read(optional: boolean): Promise<CollectionIndexData<I> | undefined> {
		return await read<CollectionIndexData<I>>(this.path, optional);
	}

	async write(data: CollectionIndexData<I>) {
		await write(this.path, data);
	}

	async prepare() {
		let data = await this.read(true);
		if (!data) {
			data = {};
			await this.write(data);
		}
	}

	async set(id: string, data: T) {
		const built = this.collection.options.index(data);
		const index = await this.read(false);
		index[id] = built;
		await this.write(index);
	}

	async delete(id: string) {
		const index = await this.read(false);
		delete index[id];
		await this.write(index);
	}
}

export class Collection<T extends object, I extends object> {
	options: CollectionOptions<T, I>;
	#index: CollectionIndex<T, I>;

	constructor(options: CollectionOptions<T, I>) {
		this.options = options;
		this.#index = new CollectionIndex<T, I>(this);
	}

	async prepare(): Promise<void> {
		await fs.mkdir(this.path, { recursive: true });
		await this.#index.prepare();
	}

	get path() {
		return path.join(this.options.base, this.options.name);
	}

	pathForId(id: string) {
		return path.join(this.path, `${id}.json`);
	}

	validateId(id: string): void {
		assert(id, 'id is required');
		assert(id.match(/^[0-9a-zA-Z-]{1,32}$/), `id '${id}' must be 0-9, a-z, A-Z, 1 to 32 chars`);
	}

	async read(id: string, optional: true): Promise<T | undefined>;
	async read(id: string, optional: false): Promise<T>;
	async read(id: string, optional: boolean): Promise<T | undefined> {
		return await read<T>(this.pathForId(id), optional);
	}

	async get(id: string): Promise<CollectionDocument<T>> {
		this.validateId(id);
		const data = await this.read(id, false);
		return {
			id,
			data
		};
	}

	async set(id: string, data: T) {
		this.validateId(id);
		await write(this.pathForId(id), data, async () => {
			await this.#index.set(id, data);
		});
	}

	async delete(id: string) {
		this.validateId(id);
		await this.#index.delete(id);
		await del(this.pathForId(id));
	}

	async index(): Promise<CollectionIndexDocument<I>[]> {
		const object = await this.#index.read(false);
		return Object.keys(object).map((id) => ({ id, data: object[id] }));
	}
}
