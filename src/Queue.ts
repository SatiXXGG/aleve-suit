import { Thread } from "./Thread";

export class Queue<T extends defined> {
	private queue: T[];
	private processCallback: (x: T) => void;
	constructor(processCallback: (x: T) => void, processEvery = 0) {
		this.processCallback = processCallback;
		this.queue = [];
		if (processEvery > 0) {
			const thread = coroutine.create(() => {
				while (task.wait(processEvery)) {
					this.process(processEvery / this.queue.size());
				}
			});

			coroutine.resume(thread);
		}
	}

	public add(value: T) {
		this.queue.push(value);
	}

	public process(processDelay = 0) {
		this.queue.forEach((value) => {
			this.processCallback(value);
			task.wait(processDelay);
		});
		this.queue.clear();
	}

	public getCurrentQueue() {
		return this.queue;
	}

	public processAsync() {
		this.queue.forEach((value, index) => {
			this.queue.remove(index);
			coroutine.wrap(() => {
				this.processCallback(value);
			})();
		});
	}

	destroy() {
		this.queue.clear();
		this.processCallback = undefined!;
	}
}
