import { readFileSync } from "node:fs";
import { argv } from "node:process";
import repl from "node:repl";
type success = { result: string; };
type error = { error: string; };
type returntype = success | error;



export function parseInput(msg: string): returntype {
	const result: Array<string> = [];
	const cssreg = /^(?:\:delete\s*)?\.(\w+)(\s*\[\w*="[^"].*"\]*)*\s*\{\s*((?:\w+[=\".\";]*\s*)*?)\s*\}/gm;
	const attrregex = /\[(\w+)="([^"]*)"\]/g;
	const parse = [...msg.matchAll(cssreg)];
	if (parse.length === 0) {
		return { error: "input is not accepted" };
	}
	for (const match of parse) {
		let [_, table, attr, selector] = match;
		const attributes: Array<string> = [];
		if (attr !== undefined) {
			const selectAttribute = attr.matchAll(attrregex);
			const parsedattri = [...selectAttribute];
			attributes.push(...parsedattri.map(x => `${x[1]}='${x[2]}'`));
		}
		//check for setting Parameter
		if (attr == undefined && selector.includes("=")) {
			//insert
			result.push(insert({ selector, table }));
		} else if (selector.includes("=") && attr.includes("=")) {
			// Update
			result.push(update({ selector, table, attributes }));
		} else if (match.input.slice(0, 7) === ":delete") {
			//delete
			result.push(deletefn({ table, attributes, selector }));
		} else {
			// Selector
			result.push(select({ selector, table, attributes }));
		}
	}
	return { result: result.join("\n") };
}

function select({ selector, table, attributes }: { selector: string, table: string, attributes: Array<string> }) {
	let newSelector = "";
	if (selector === "") {
		newSelector = "*";
	} else {
		newSelector = selector.split(";").map(x => x.trim()).filter(x => x).join(",");
	}
	if (attributes.length > 0) {
		return `select ${newSelector} from ${table} where ${attributes.join(" and ")};`;
	} else {
		return `select ${newSelector} from ${table};`;
	}
}
function insert({ selector: input, table }: { selector: string, table: string }) {
	const i = input.split(";")?.filter((x: string) => x)?.map((x: string) => { const s = x?.split("="); return [s[0], s[1]?.slice(1, -1)] });
	if (i == undefined) {
		console.log("Empty selector")
	}
	const selector = i.map((x: Array<string>) => x[0]);
	const values = i.map((x: Array<string>) => x[1]);
	const retString = `insert into ${table} (${selector.join(",")}) values ('${values.join("','")}');`;
	return retString;
}

function update({ table, selector, attributes }: { selector: string, table: string, attributes: Array<string> }) {
	const newSelector = selector
		.trim()
		.split(";")
		.filter((x: string) => x)
		.map((x: string) => x.replaceAll('"', "'")).join(",");
	return `update ${table} set ${newSelector} where ${attributes.join(",")};`
}
function deletefn({ table, attributes, selector }: { table: string, attributes: Array<string>, selector: string }, ...r: any) {
	if (attributes.length === 0) {
		return `delete from ${table};`
	}
	return `delete from ${table} where ${attributes.join(" and ")};`

}
(() => {
	if (require.main === module) {
		if (process.argv[2] !== undefined) {
			const data = readFileSync(process.argv[2], "utf8")
			const res = parseInput(data)
			if ("error" in res) {
				console.error(res.error)
			} else {
				console.log(res.result)
			}
			return
		}

		console.log("Welcome to the DataStyle repl!")
		console.log("Please add an _ to your Input, if it starts with [.]!")
		repl.start({ prompt: "->", eval: Eval });
	}
	function Eval(uInput: string, _context: any, _filename: string, callback: Function) {
		callback(null, helper(uInput[0] === "_" ? uInput.slice(1) : uInput))
	}

	function helper(uInput: string) {
		const res = parseInput(uInput);
		if ("error" in res) {
			console.error(res.error);
		} else {
			return res.result;
		}
	}

})()
