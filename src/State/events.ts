import Net from "@rbxts/net";

export const events = Net.CreateDefinitions({
	client: Net.Definitions.ServerToClientEvent<[name: string, x: unknown]>(),
});
