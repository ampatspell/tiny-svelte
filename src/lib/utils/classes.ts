type ClassesArg = string | undefined | null;

export const classes = (...args: ClassesArg[]) => {
	const arr = <string[]>[];
	args.forEach((arg) => {
		const type = typeof arg;
		if (type === 'string') {
			if (arg) {
				arr.push(arg);
			}
		}
	});
	return arr.join(' ');
};
