export class Signal<T> {
	private callbacks = new Set<(args: T) => void>();
	listen(callback: (args: T) => void) {
		this.callbacks.add(callback);
	}
	call(args: T) {
		this.callbacks.forEach((callback) => callback(args));
	}
	constructor() {}
}
