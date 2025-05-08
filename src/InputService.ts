import { Trove } from "@rbxts/trove";

const UserInputService = game.GetService("UserInputService");
const debug = false;
export class InputService {
	private beganInputs = new Set<Input>();
	private releaseInputs = new Set<Input>();

	private trove = new Trove();
	constructor(canUseChecker: (keycode: Enum.KeyCode | Enum.UserInputType, processed: boolean) => boolean) {
		const onInputBegan = (user: InputObject, processed: boolean) => {
			if (canUseChecker(user.KeyCode, processed)) {
				this.beganInputs.forEach((input) => {
					if (debug) {
						print(input.keycode === user.KeyCode || input.keycode === user.UserInputType, input.callback);
						warn(input.cooldown ? "Is on cooldown" : "");
					}
					if (
						(input.keycode === user.KeyCode || input.keycode === user.UserInputType) &&
						input.callback &&
						input.enabled &&
						!input.cooldown
					) {
						if (input.nativeCooldown > 0) {
							input.cooldown = true;
							task.delay(input.nativeCooldown, () => {
								input.cooldown = false;
							});
						}
						input.callback();
					}
				});
			}
		};

		const onInputRelease = (user: InputObject, processed: boolean) => {
			if (canUseChecker(user.KeyCode, processed)) {
				this.releaseInputs.forEach((input) => {
					if ((input.keycode === user.KeyCode || input.keycode === user.UserInputType) && input.callback) {
						if (input.nativeCooldown > 0) {
							input.cooldown = true;
							task.delay(input.nativeCooldown, () => {
								input.cooldown = false;
							});
						}
						input.callback();
					}
				});
			}
		};

		this.trove.connect(UserInputService.InputBegan, onInputBegan);
		this.trove.connect(UserInputService.InputEnded, onInputRelease);
	}

	addBeganInput(input: Input) {
		this.beganInputs.add(input);
	}

	addReleaseInput(input: Input) {
		this.releaseInputs.add(input);
	}

	clear() {
		this.trove.clean();
	}
}

export class Input {
	public readonly keycode: Enum.KeyCode | Enum.UserInputType;
	public callback?: () => void;
	public nativeCooldown: number = 0;
	public cooldown = false;
	public enabled = true;
	constructor(keycode: Enum.KeyCode | Enum.UserInputType) {
		this.keycode = keycode;
	}

	onPress(callback: () => void) {
		this.callback = callback;
	}
}
