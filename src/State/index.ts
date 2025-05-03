import { Value } from "../Value";
import { events } from "./events";
export namespace State {
	export class Server<T> {
		static values = new Map<string, Value<unknown>>();
		public value = new Value<T>();
		private player: Player | undefined;
		private name: string;
		private lastState = this.value.get();

		constructor(name: string, startValue: T, player?: Player) {
			this.name = name;
			this.player = player;
			if (game.GetService("RunService").IsServer()) {
				this.value.set(startValue);
				const event = events.Server.Get("client");

				this.value.listen((value) => {
					this.lastState = value;
					if (this.player) {
						event.SendToPlayer(this.player, name, value);
					} else {
						event.SendToAllPlayers(name, value);
					}
				});

				Server.values.set(this.name, this.value as Value<unknown>);
			} else if (game.GetService("RunService").IsClient()) {
				this.bindClient();
			}
		}

		private bindClient() {
			State.Client.values.set(this.name, this.value as Value<unknown>);
		}

		public destroy() {
			this.value.destroy();
		}

		static init() {
			const event = events.Server.Get("recover");
			event.Connect((player, name) => {
				const gotValue = Server.values.get(name);
				if (gotValue !== undefined) {
					gotValue.update((x) => x);
				}
			});
		}
	}

	export class Client<T> {
		static values = new Map<string, Value<unknown>>();
		public value = new Value<T>();
		private name: string;
		constructor(name: string, executionId?: string) {
			this.name = name;
			Client.values.set(this.name, this.value as Value<unknown>);
		}

		recover() {
			const event = events.Client.Get("recover");
			event.SendToServer(this.name);
		}

		bindProperty(property: keyof T, callback: (value: T[keyof T]) => void) {
			this.value.onPropertyUpdate(property, callback);
		}

		static init() {
			const event = events.Client.Get("client");
			event.Connect((name, value) => {
				const gotValue = Client.values.get(name);
				if (gotValue !== undefined) {
					gotValue.set(value);
				}
			});
		}
	}
}
