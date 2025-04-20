import { Signal } from "../Signal";
import { Value } from "../Value";
import { events } from "./events";

export namespace State {
	export class Server<T> {
		public value = new Value<T>();
		private player: Player | undefined;
		constructor(name: string, startValue: T, player?: Player) {
			this.value.set(startValue);
			this.player = player;
			if (game.GetService("RunService").IsServer()) {
				const event = events.Server.Get("client");

				this.value.listen((value) => {
					if (this.player) {
						event.SendToPlayer(this.player, name, value);
					} else {
						event.SendToAllPlayers(name, value);
					}
				});
			}
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
