export class Character {
	private character: Model;
	private humanoid: Humanoid | undefined;
	private humanoidRootPart: BasePart | undefined;
	constructor(character: Model) {
		this.character = character;
	}

	getHumanoid(waitTime = 999) {
		if (this.humanoid) return this.humanoid;
		this.humanoid = this.character.WaitForChild("Humanoid", waitTime) as Humanoid;
		return this.humanoid;
	}

	tpTo(position: Vector3) {
		if (!this.humanoidRootPart) {
			this.humanoidRootPart = this.character.WaitForChild("HumanoidRootPart", 999) as BasePart;
		}

		this.humanoidRootPart.CFrame = new CFrame(position);
	}

	getHumanoidRoot() {
		if (!this.humanoidRootPart) {
			this.humanoidRootPart = this.character.WaitForChild("HumanoidRootPart", 999) as BasePart;
		}
		return this.humanoidRootPart;
	}
}
