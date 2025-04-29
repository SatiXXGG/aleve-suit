import { Signal } from "../Signal";
import { Value } from "../Value";
import { events } from "./events";

export namespace State {
	export class Server<T> {
		public value = new Value<T>();
		private player: Player | undefined;
		private name: string;
		constructor(name: string, startValue: T, player?: Player) {
			this.name = name;
			this.player = player;
			if (game.GetService("RunService").IsServer()) {
				this.value.set(startValue);
				const event = events.Server.Get("client");

				this.value.listen((value) => {
					if (this.player) {
						event.SendToPlayer(this.player, name, value);
					} else {
						event.SendToAllPlayers(name, value);
					}
				});
			} else if (game.GetService("RunService").IsClient()) {
				this.bindClient();
			}
		}

		private bindClient() {
			State.Client.values.set(this.name, this.value as Value<unknown>);
		}

		private destroy() {
			this.value.destroy();
		}
	}

	export class Client<T> {
		static values = new Map<string, Value<unknown>>();
		public value = new Value<T>();
		constructor(name: string) {
			Client.values.set(name, this.value as Value<unknown>);
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
