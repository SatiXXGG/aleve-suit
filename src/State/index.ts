import { Signal } from "../Signal";
import { events } from "./events";

export namespace State {
	export class Client<X> {
		static map = new Map<string, Signal>();
		public Signal = new Signal<X>();
		static client = events.Client.Get("client");
		private name = "";
		constructor(name: string) {
			this.name = name;
			Client.map.set(this.name, this.Signal as Signal);
		}

		static init() {
			Client.client.Connect((name, x) => {
				const signal = Client.map.get(name);
				if (signal) {
					signal.call(x);
				}
			});
		}
	}
	export class Server<X> {
		public Signal = new Signal<{ Player?: Player; Value: X; name: string }>();
		static client = events.Server.Get("client");
		private name = "";
		constructor(name: string) {
			this.name = name;
			this.Signal.listen((x) => {
				if (x.Player) {
					Server.client.SendToPlayer(x.Player, x.name, x.Value);
				} else {
					Server.client.SendToAllPlayers(x.name, x.Value);
				}
			});
		}

		call(x: X, player?: Player) {
			this.Signal.call({
				Player: player,
				Value: x,
				name: this.name,
			});
		}
	}
}
