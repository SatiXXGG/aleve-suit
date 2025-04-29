type onChangeCallback<T> = (value: T) => void;

export class Value<T> {
	private onChangeCallbacks = new Set<onChangeCallback<T>>();
	private value: T | undefined;

	constructor(startValue?: T) {
		this.value = startValue;
	}

	listen(callback: onChangeCallback<T>) {
		this.onChangeCallbacks.add(callback);
	}

	set(value: T) {
		this.value = value;
		this.onChangeCallbacks.forEach((callback) => callback(value));
	}

	update(callback: (v: T) => T) {
		this.value = callback(this.value!);
		this.onChangeCallbacks.forEach((callback) => callback(this.value!));
	}

	get() {
		return this.value;
	}

	destroy() {
		this.onChangeCallbacks.clear();
		this.value = undefined;
	}
}
