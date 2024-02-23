import { dirname as _dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const dirname = (importMetaUrl: string) => {
	return _dirname(fileURLToPath(importMetaUrl));
};

const ONCE = new Set<string>();

export const once = async (token: string, cb: () => Promise<void>): Promise<void> => {
	if (ONCE.has(token)) {
		return;
	}
	ONCE.add(token);
	await cb();
};
