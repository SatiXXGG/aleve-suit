//**

//  */

const typos = ["#", "*", "="];
type PathTipos = "#" | "" | "*" | "?" | "=";
type FindPathStyle = `${PathTipos}${string}`;
export class Path {
	/**
	 *
	 * Returns a Instance with the type X that needs to be specified
	 * @param parent
	 * @param path
	 * @returns
	 * @typo #, *, =
	 * * Gets the current childs
	 * #Makes a WaitForChild on the instance
	 * =search for an instance with the attribute if a ? is provided the checks the value is that one
	 *     for example isOpen?true
	 *     it can also be >, <
	 * Nothing makes a regular FindFirstChild
	 */
	static find<T, X = T>(parent: Instance = game.GetService("Workspace"), path: FindPathStyle): X {
		let lastInstance: Instance | undefined = parent;
		let lastTypo = "" as PathTipos;
		const paths = path.split("/");
		paths.forEach((value, index) => {
			const typo = value.sub(0, 1) as string;
			const find = value.sub(2, value.size());
			if (lastInstance === undefined) {
				return;
			}
			if (typos.includes(typo)) {
				if (typo === "#") {
					lastInstance = lastInstance.WaitForChild(find) as Instance;
				} else if (typo === "*" && index === paths.size() - 1) {
					lastInstance = lastInstance.WaitForChild(find);
				} else if (typo === "*") {
					error("Typo * is only supported at the end of the path");
				} else if (typo === "=") {
					const childs = lastInstance.GetChildren();
					const conditional = find.split("?");
					const conditionalValue = conditional[1];
					const conditionalFind = conditional[0];
					let typoReturn: Instance | undefined = undefined;
					childs.forEach((child) => {
						if (conditionalValue !== undefined) {
							const att = child.GetAttribute(conditionalFind);
							const attType = type(att);

							if (attType === "number") {
								const a = tonumber(conditionalValue);
								const b = tonumber(att);
								if (a !== undefined && b !== undefined && a === b) {
									typoReturn = child;
									return;
								}
							} else if (attType === "string") {
								if (att === conditionalValue) {
									typoReturn = child;
									return;
								}
							} else if (attType === "boolean") {
								const a = conditionalValue === "true" ? true : false;
								const b = att;
								if (a !== undefined && b !== undefined && a === b) {
									typoReturn = child;
									return;
								}
							}
						} else {
							if (child.GetAttribute(find) as boolean) {
								typoReturn = child;
								return;
							}
						}
					});

					if (typoReturn) {
						lastInstance = typoReturn;
					} else {
						lastInstance = undefined;
					}
				}
				lastTypo = typo as PathTipos;
			} else {
				lastInstance = lastInstance.FindFirstChild(value) as Instance;
				if (!lastInstance) {
					error("error finding instance " + value + " in " + path);
				}
			}
		});
		if (lastTypo === "*") {
			return lastInstance.GetChildren() as Array<Instance> as X;
		} else {
			return lastInstance as X;
		}
	}
	/**
	 *
	 * Returns a Instance with, ignores the typo * and will always return the type T
	 * @param parent
	 * @param path
	 * @returns
	 * @typo #
	 */
	static findOne<T>(parent: Instance = game.GetService("Workspace"), path: FindPathStyle): T {
		let lastInstance: Instance = parent;
		let lastTypo = "" as PathTipos;
		const paths = path.split("/");
		paths.forEach((value, index) => {
			const typo = value.sub(0, 1) as string;
			if (typos.includes(typo)) {
				if (typo === "#") {
					lastInstance = lastInstance.WaitForChild(value.sub(2, value.size())) as Instance;
				} else if (typo === "*") {
					error("Typo * is not supported in FindOne method");
				}
				lastTypo = typo as PathTipos;
			} else {
				lastInstance = lastInstance.FindFirstChild(value) as Instance;
				if (!lastInstance) {
					error("error finding instance " + value + " in " + path);
				}
			}
		});

		return lastInstance as T;
	}
	/**
	 *
	 * Will always return a the childs of the last instance without the typo *
	 * @param parent
	 * @param path
	 * @returns
	 * @typo #, *, =
	 */
	static findMany(parent: Instance = game.GetService("Workspace"), path: FindPathStyle) {
		let lastInstance: Instance = parent;
		let lastTypo = "" as PathTipos;

		const paths = path.split("/");
		paths.forEach((value, index) => {
			const typo = value.sub(0, 1) as string;
			if (typos.includes(typo)) {
				const find = value.sub(2, value.size());
				if (typo === "#") {
					lastInstance = lastInstance.WaitForChild(find) as Instance;
				} else if (typo === "*" && index === paths.size() - 1) {
					lastInstance = lastInstance.WaitForChild(find);
				} else if (typo === "*") {
					error("Typo * is only supported at the end of the path");
				}
				lastTypo = typo as PathTipos;
			} else {
				lastInstance = lastInstance.FindFirstChild(value) as Instance;
				if (!lastInstance) {
					error("error finding instance " + value + " in " + path);
				}
			}
		});
		if (lastTypo === "*") {
			return lastInstance.GetChildren();
		} else if (lastTypo === "=") {
			const childs = lastInstance.GetChildren();
			const find = paths[paths.size() - 1].sub(2, paths[paths.size() - 1].size());
			let s = "?";
			let conditional = find.split("?");
			if (conditional[1] === undefined) {
				conditional = find.split(">");
				s = ">";
			}
			if (conditional[1] === undefined) {
				conditional = find.split("<");
				s = "<";
			}
			const conditionalValue = conditional[1];
			const conditionalFind = conditional[0];
			const typoReturn: Array<Instance> = new Array();
			childs.forEach((child) => {
				if (conditionalValue !== undefined) {
					const att = child.GetAttribute(conditionalFind);
					const attType = type(att);
					if (attType === "number") {
						const a = tonumber(conditionalValue);
						const b = tonumber(att);
						if (a !== undefined && b !== undefined) {
							if (s === ">" && b > a) {
								typoReturn.push(child);
							} else if (s === "<" && b < a) {
								typoReturn.push(child);
							} else if (s === "?" && b === a) {
								typoReturn.push(child);
							}
						}
					} else if (attType === "string") {
						if (att === conditionalValue) {
							typoReturn.push(child);
						}
					} else if (attType === "boolean") {
						const a = conditionalValue === "true" ? true : false;
						const b = att;
						if (a !== undefined && b !== undefined && a === b) {
							typoReturn.push(child);
						}
					}
				} else {
					if (child.GetAttribute(find) !== undefined) {
						typoReturn.push(child);
					}
				}
			});

			return typoReturn;
		}
	}

	static concat(...args: Array<FindPathStyle>) {
		return args.join("/");
	}
}
