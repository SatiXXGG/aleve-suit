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

	static waitEventWithTimeout(time: number, event: RBXScriptSignal) {
		return new Promise((resolve) => {
			const connection = event.Connect(() => {
				connection.Disconnect();
				resolve(true);
			});
			task.wait(time);
			connection.Disconnect();
			resolve(true);
		});
	}
}
