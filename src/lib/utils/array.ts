export type SortDescriptor<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: (object: T) => any;
	direction?: 'asc' | 'desc';
};

export function sortedBy<T>(arr: T[], descriptors: SortDescriptor<T> | SortDescriptor<T>[]): T[] {
	if (!Array.isArray(descriptors)) {
		descriptors = [descriptors];
	}
	let sorted = [...arr];
	for (const descriptor of descriptors) {
		sorted = sorted.sort((a, b) => {
			const av = descriptor.value(a);
			const bv = descriptor.value(b);
			if (av === bv) {
				return 0;
			}
			if (descriptor.direction === 'desc') {
				return av < bv ? 1 : -1;
			} else {
				return av < bv ? -1 : 1;
			}
		});
	}
	return sorted;
}
