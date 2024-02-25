// eslint-disable-next-line @typescript-eslint/ban-types
export const action = <T extends Function>(
	target: object,
	key: string,
	descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> => {
	return {
		configurable: true,
		get(this: T): T {
			const bound: T = descriptor.value!.bind(this);
			Object.defineProperty(this, key, {
				value: bound,
				configurable: true,
				writable: true
			});
			return bound;
		}
	};
};
