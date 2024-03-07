import type { Handle } from '@sveltejs/kit';
import { Collection } from './collection';
import { dirname, once } from './utils';
import path from 'path';
import type { AssetData, AssetIndex, WorkspaceData, WorkspaceIndex, WorkspaceNodeData, WorkspaceNodeIndex } from '$lib/types';

export class Collections {
	assets: Collection<AssetData, AssetIndex>;
	workspaces: Collection<WorkspaceData, WorkspaceIndex>;
	workspaceNodes: Collection<WorkspaceNodeData, WorkspaceNodeIndex>;

	constructor() {
		const base = path.join(dirname(import.meta.url), 'collections');

		this.assets = new Collection({
			base,
			name: 'assets',
			index: ({ parent, type, identifier }: AssetData) => ({
				parent,
				type,
				identifier
			})
		});

		this.workspaces = new Collection({
			base,
			name: 'workspaces',
			index: ({ identifier }: WorkspaceData) => ({
				identifier
			})
		});

		this.workspaceNodes = new Collection({
			base,
			name: 'workspace-nodes',
			index: () => ({})
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
};

export const server: Handle = async ({ event, resolve }) => {
	event.locals.server = await createServer();
	return resolve(event);
};
