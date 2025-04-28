//@ts-ignore
import { log } from "console";
//@ts-ignore
import { err } from "./error.cts";

export class Class {
	attributes: AttributeStatement[] = [];
	selectors: SelectorStatement[] = []
	name: string;
	constructor(name: string, attributes: AttributeStatement[], selectors: SelectorStatement[]) {
		this.name = name;
		this.attributes = attributes;
		this.selectors = selectors;
	}
}

export class AttributeStatement {
	name: string;
	value: string;
	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
	}
}
export class SelectorStatement {
	value: string | undefined;
	name: string;
	constructor(name: string, value?: string) {
		this.name = name;
		this.value = value;
	}
}

export function makeStmt(ast: Class[]) {
	const res: Array<string> = [];
	for (const stmt of ast) {
		const { name, selectors, attributes } = stmt;
		// log({ name, selectors, attributes })
		if (selectors.at(0)?.value !== undefined && attributes.length > 0) {
			res.push(update({ name, selectors, attributes }))
		} else if (selectors.at(0)?.value !== undefined && attributes.length === 0) {
			res.push(insert({ name, selectors, attributes }))
		} else if (selectors.at(0)?.value === undefined) {
			res.push(select({ name, selectors, attributes }))
		} else {
			res.push(update({ name, selectors, attributes }))
		}


	}

	return res.join("\n")
}

function update(ast: Class) {
	const whereClause = ast.attributes.length > 0 ? ` where ${ast.attributes.map(x => `${x.name}=${x.value}`).join(" and ")}` : "";
	const clause = `update ${ast.name} set ${ast.selectors.map(x => `${x.value}=${x.name}`)}${whereClause};`;
	return clause;
}
function insert(ast: Class) {
	const whereClause = ast.attributes.length > 0 ? ` where ${ast.attributes.map(x => `${x.name}=${x.value}`).join(" and ")} ` : "";
	const clause = `insert into ${ast.name} (${ast.selectors.map(x => x.name)}) values(${ast.selectors.map(x => x.value)})${whereClause}; `
	return clause
}
function select(ast: Class): string {
	const whereClause = ast.attributes.length > 0 ? ` where ${ast.attributes.map(x => `${x.name}=${x.value}`).join(" and ")}` : "";
	const clause = `select ${ast.selectors.map(x => x.name)} from ${ast.name}${whereClause};`
	return clause
}
