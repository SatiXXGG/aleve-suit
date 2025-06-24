export class Cache<X, T> {
	public cache = new Map<
		X,
		{
			lifeTime: number;
			value: T;
			createdOn: number;
		}
	>();
	constructor() {}

	set(key: X, value: T, lifeTime: number) {
		this.cache.set(key, {
			lifeTime,
			value,
			createdOn: os.time(),
		});
	}

	get(key: X) {
		const value = this.cache.get(key);
		if (value) {
			const lifeTime = value.lifeTime;
			const data = value.value;
			const createdOn = value.createdOn;

			if (os.time() - createdOn > lifeTime) {
				this.cache.delete(key);
				return undefined;
			}
			return data;
		}
	}

	clear() {
		this.cache.clear();
	}

	clearKey(key: X) {
		this.cache.delete(key);
	}

	forEach(callback: (index: X, value: T) => void) {
		this.cache.forEach((value, key) => {
			callback(key, value.value);
		});
	}
}
