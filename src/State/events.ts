import Net from "@rbxts/net";

export const events = Net.CreateDefinitions({
	client: Net.Definitions.ServerToClientEvent<[id: string, value: unknown]>(),
	recover: Net.Definitions.ClientToServerEvent<[id: string]>(),
});
