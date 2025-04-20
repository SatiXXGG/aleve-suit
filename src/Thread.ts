export class Thread {
	static delayAsync(time: number, callback: () => void) {
		coroutine.wrap(() => {
			task.wait(time);
			callback();
		})();
	}

	static delaySync(time: number, callback: () => void) {
		task.wait(time);
		callback();
	}
}
