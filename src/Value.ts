type onChangeCallback<T> = (value: T) => void;

enum UtilityContext {
	set = "set",
	update = "update",
	get = "get",
	none = "none",
}

export class Value<T> {
	private onChangeCallbacks = new Set<onChangeCallback<T>>();
	private onPropertyChangeCallbacks: {
		[K in keyof T]?: onChangeCallback<T[K]>;
	} = {};

	private value: T | undefined;
	public lastContext: UtilityContext = UtilityContext.none;
	private lastValue: T | undefined;

	constructor(startValue?: T) {
		this.value = startValue;
		this.lastValue = undefined;

		this.onChangeCallbacks.add((value) => {
			if (this.lastValue === undefined || type(value) !== "table") return;
			const changedProperties: string[] = [];
			const converted = value as Record<string, unknown>;

			for (const [key, value] of pairs(converted)) {
				if (value !== this.lastValue![key as keyof T]) {
					changedProperties.push(key as string);
				}
			}
			changedProperties.forEach((property) => {
				const callback = this.onPropertyChangeCallbacks[property as keyof T];
				if (callback) {
					callback(value![property as keyof T] as T[keyof T]);
				}
			});
		});
	}

	listen(callback: onChangeCallback<T>) {
		this.onChangeCallbacks.add(callback);
	}

	set(value: T) {
		this.lastContext = UtilityContext.set;
		this.value = value;
		this.onChangeCallbacks.forEach((callback) => callback(value));
		this.lastValue = this.value;
	}

	update(callback: (v: T) => T) {
		this.lastContext = UtilityContext.update;
		this.value = callback(this.value!);
		this.onChangeCallbacks.forEach((callback) => callback(this.value!));

		if (type(this.value) === "table") {
			this.lastValue = { ...this.value };
		} else {
			this.lastValue = this.value;
		}
	}

	onPropertyUpdate<K extends keyof T>(property: K, callback: onChangeCallback<T[K]>) {
		this.onPropertyChangeCallbacks[property] = callback;
	}

	get() {
		this.lastContext = UtilityContext.get;
		return this.value;
	}

	destroy() {
		this.onChangeCallbacks.clear();
		this.value = undefined;
	}
}
