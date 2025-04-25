//@ts-ignore
import { Lexer } from "./lexer.cts"
//@ts-ignore
import { Token, TokenType } from "./token.cts";

function parseClasses(tokens: Array<Token>) {
	const AST = [];
	for (const token of tokens) {
		if (token.token === TokenType.L_CURL_BRACE) break
		if (token.token === TokenType.CLASS) AST.push(token.value);
	}
	return AST;
}

function parseAttributes(tokens: Array<Token>) {
	const AST = [];
	const end = tokens.findIndex(x => x.token === TokenType.L_CURL_BRACE);
	for (let i = 0; i < end; i++) {
		if (
			tokens[i + 0]?.token === TokenType.L_BRACKET &&
			tokens[i + 1]?.token === TokenType.LITERAL &&
			tokens[i + 2]?.token === TokenType.EQALS &&
			tokens[i + 3]?.token === TokenType.QUOTATION &&
			tokens[i + 4]?.token === TokenType.LITERAL &&
			tokens[i + 5]?.token === TokenType.QUOTATION &&
			tokens[i + 6]?.token === TokenType.R_BRACKET
		) {
			AST.push(`${tokens[i + 1]?.value}="${tokens[i + 4]?.value}"`);
		}
		if (
			// L_BRACKET
			tokens[i + 0]?.token === TokenType.L_BRACKET &&
			tokens[i + 1]?.token === TokenType.LITERAL &&
			tokens[i + 2]?.token === TokenType.EQALS &&
			tokens[i + 3]?.token === TokenType.INT &&
			tokens[i + 4]?.token === TokenType.R_BRACKET
		) {
			AST.push(`${tokens[i + 1].value}=${tokens[i + 3].value}`);
		}
	}
	return AST;
}

function parseMutators(tokens: Array<Token>) {
	const AST = [];
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].token === TokenType.DOUBLE_COLON) {
			AST.push(tokens[i])
		}
	}


	return AST;
}
function parseSelectors(tokens: Array<Token>) {
	const AST = [];
	const start = tokens.findIndex(x => x.token === TokenType.L_CURL_BRACE)
	for (let i = start; i < tokens.length; i++) {
		if (tokens[i].token === TokenType.LITERAL && tokens[i + 1].token === TokenType.SEMICOLON) { AST.push(tokens[i].value); }
		if (
			tokens[i + 0]?.token === TokenType.LITERAL &&
			tokens[i + 1]?.token === TokenType.EQALS &&
			tokens[i + 2]?.token === TokenType.QUOTATION &&
			tokens[i + 3]?.token === TokenType.LITERAL &&
			tokens[i + 4]?.token === TokenType.QUOTATION &&
			tokens[i + 5]?.token === TokenType.SEMICOLON
		) {
			AST.push(`${tokens[i].value}="${tokens[i + 3].value}"`);
		}
		if (
			tokens[i].token === TokenType.LITERAL &&
			tokens[i + 1]?.token === TokenType.EQALS &&
			tokens[i + 2]?.token === TokenType.INT &&
			tokens[i + 3]?.token === TokenType.SEMICOLON
		) {
			AST.push(`${tokens[i].value}=${tokens[i + 2].value}`);
		}
	}
	return AST;
}

function parser(tokens: Array<Array<Token>>) {
	const result = [];
	for (const ast of tokens) {
		const classes = parseClasses(ast);
		const attributes = parseAttributes(ast);
		const selectors = parseSelectors(ast);
		const mutators = parseMutators(ast);
		if (selectors.length === 0) selectors.push("*")
		switch (true) {
			//Joins
			case classes.length > 1:
				result.push("we are not Joining Tables here!");
				break;
			case classes.length < 1:
				result.push(["No Table was choosen!", { classes, attributes, selectors }]);
				break;
			//Delete with Attributes);
			case mutators.length > 0 &&
				mutators[0].value === "delete" &&
				attributes.length > 0 &&
				classes.length === 1:
				result.push(`delete from ${classes} where ${attributes}`);
				break;
			//Delete);
			case mutators.length > 0 &&
				classes.length === 1:
				result.push(`Something else from ${classes}`);
				break;
			//Update);
			case selectors.length >= 1 && selectors[0]?.at(1) !== undefined && attributes.length > 0 && classes.length === 1:
				result.push(`update ${classes} set ${selectors} where ${attributes};`);
				break;
			//INSERT);
			case selectors.length > 0 && selectors[0]?.at(1) !== undefined && attributes.length == 0 && classes.length === 1:
				result.push(`insert into ${classes} (${selectors.map(x => x?.split("=")[0])}) where ${selectors.map(x => x?.split("=")[1])};`);
				break;
			//SELECT with attributes and selectors
			case selectors.length > 0 && attributes.length > 0 && classes.length === 1:
				result.push(`select ${selectors} from ${classes} where ${attributes.join(",")};`);
				break;
			//SELECT );
			case selectors.length === 1 && attributes.length === 0 && classes.length === 1:
				result.push(`select ${selectors.join(",")} from ${classes};`);
				break;
			default:
				result.push(["Something went wrong", JSON.stringify({ classes, attributes, selectors })]);
		}
	}
	return result.join("\n")
}

function splitTokens(tokens: Array<Token>) {
	const ast = [];
	let start = 0;
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].token === TokenType.R_CURL_BRACE) {
			ast.push(tokens.slice(start, i + 1))
			start = i + 1;
		}
	}
	return ast
}
const tokens: Array<Token> = [];
const lex = new Lexer('.table2[attr2=332][attr2="hallo"]{}\n.token{}\n:delete.table1{}');
// const lex = new Lexer('.table{a=123;b="asdf";c=321;}');
while (true) { const i = lex.next(); if (!i) break; tokens.push(i); }
console.log(parser(splitTokens(tokens)))
