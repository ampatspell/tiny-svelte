import { browser } from '$app/environment';
import type { Router } from '$server/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import { page } from '$app/stores';

let _client: ReturnType<typeof createTRPCClient<Router>>;

function createClient(init?: TRPCClientInit) {
	if (browser && _client) {
		return _client;
	}
	const client = createTRPCClient<Router>({ init });
	if (browser) {
		_client = client;
	}
	return client;
}

let init = $state<TRPCClientInit>();

$effect.root(() =>
	page.subscribe((page) => {
		init = page;
	})
);

export const useTRPC = () => createClient(init);
