const isFunc = fn => fn && typeof fn === 'function';

const defineImmutable = (host, name, val) => {
	const value = typeof val === 'function' ? val.bind(host) : val;
	Object.defineProperty(host, name, {
		enumerable: false,
		immutable: false,
		configurable: true,
		value
	});
};

export default (host, errorHandler) => {
	const hostUse = host.use;

	defineImmutable(host, 'use', (...args) => {
		const [Middleware] = args;
		const { default: Module = Middleware } = Middleware;
		try {
			if (!Module) {
				throw new TypeError(`${host.constructor.name} does not accept middleware of type ${typeof Module}`);
			}

			if (isFunc(Module.constructor)) return new Module(host);
			return Module(host);
		} catch (e) {
			if (isFunc(errorHandler)) errorHandler(e);
			else throw e;
		}
		if (isFunc(hostUse)) hostUse.apply(host, args);
		return null;
	});
};
