export class Time {
	private time = 0;
	constructor() {}
	start() {
		this.time = tick();
	}
	stop() {
		return tick() - this.time;
	}

	format(time: number) {
		const minutes = math.floor(time / 60);
		const seconds = math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	}
}
