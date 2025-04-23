type success = { result: string; };
type error = { error: string; };
type returntype = success | error;

export function parseInput(msg: string): returntype {
	const result: Array<string> = [];
	const cssreg = /^\.(\w+)(\s*\[\w*="[^"].*"\]*)*\s*\{\s*((?:\w+[=".|/b*?"]*\s*;?\s*)*?)\s*\}/gm;
	const attrregex = /\[(\w+)="([^"]*)"\]/g;
	const parse = [...msg.matchAll(cssreg)];
	if (parse.length === 0) {
		return { error: "input is not accepted" };
	}
	for (const match of parse) {
		let [_, table, attr, selector] = match;
		let attributes: Array<string> = [];
		//check for setting Parameter
		if (attr == undefined && selector.includes("=")) {
			//insert
			result.push(insert({ selector, table }));
		} else if (selector.includes("=") && attr.includes("=")) {
			// Update
			result.push(update({ selector, table, attributes: attr.slice(1, -1) }));
		} else {
			// Selector
			if (attr !== undefined) {
				const selectAttribute = attr.matchAll(attrregex);
				const parsedattri = [...selectAttribute];
				attributes.push(...parsedattri.map(x => `${x[1]}='${x[2]}'`));
			}
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
	// console.log({ input, table })
	const i = input.split(";")?.filter((x: string) => x)?.map((x: string) => { const s = x?.split("="); return [s[0], s[1]?.slice(1, -1)] });
	if (i == undefined) {
		console.log("Empty selector")
	}
	const selector = i.map((x: Array<string>) => x[0]);
	const values = i.map((x: Array<string>) => x[1]);
	const retString = `insert into ${table} (${selector.join(",")}) values ('${values.join("','")}');`;
	return retString;
}

function update({ table, selector, attributes }: { selector: string, table: string, attributes: string }) {
	const newSelector = selector
		.trim()
		.split(";")
		.filter((x: string) => x)
		.map((x: string) => x.replaceAll('"', "'")).join(",");
	return `update ${table} set ${newSelector} where ${attributes.replaceAll("\"", "'")};`
}

if (require.main === module) {
	const result = parseInput(`.table[attribute_name="<value>"]{selector1; selector2;}`);
	if ("error" in result) {
		console.log("Something went Wrong");
	} else {
		// select selector1,selector2 from table where attribute_name='<value>';
		// console.log(result.result, `\nselect selector1,selector2 from table where attribute_name='<value>';`);

		const res = [
			// Select
			".table{}",
			".table{id;}",
			".table[attr=\"hello\"]{ id; data;}",
			// //Insert
			".table{ id=\"Hello\"; data=\"User\";}",
			// //Update
			".table[attr=\"123\"]{id=\"Hello\";data=\"User\";}",
		];

		//@ts-ignore
		res.forEach(x => console.log(x, parseInput(x)?.result))
	}
}

