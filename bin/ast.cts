import { error } from "console"
//@ts-ignore
import { Lexer } from "./lexer.cts"
//@ts-ignore
import { TokenType, Statement, Token } from "./token.cts";
//@ts-ignore
import { logError, ERRORMSG, err, ok } from "./error.cts";
//@ts-ignore
import { AttributeStatement, Class, makeStmt, SelectorStatement } from "./sql.cts";
function log(...any: any) { const linenr = new Error().stack?.split("\n").at(2)?.split(":").at(1); console.log(linenr + ":", ...any) };


export class ASTMAKER {
	tokens: Array<Token>;
	Ast: Class[] = [];
	constructor(tokens: Array<Token>) {
		this.tokens = tokens;
		const Stmt = this.splitTokens(this.getTokens())
		for (const stmt of Stmt) {
			const res = this.makeAST(this.parseTokens(stmt))
			if (res.isErr()) {
				error(res.get())
				return
			}
			this.Ast.push(res.get());
		}
	}
	getTokens() { return this.tokens; }
	getAst() { return this.Ast; }

	splitTokens(tokens: Token[]) {
		const ast = [];
		let start = 0;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].token === TokenType.R_CURL_BRACE) {
				i++;
				ast.push(tokens.slice(start, i));
				start = i;
			}
		}
		return ast
	}
	parseTokens(tokens: Token[]) {
		const statements = [];
		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index];
			switch (token.token) {
				case TokenType.L_BRACKET: {
					const start = index;
					while (tokens[index].token !== TokenType.R_BRACKET) { index++ };
					if (tokens.slice(start + 1, index).length < 3) { logError(ERRORMSG.NOT_ENOUGH_ARGUMENTS, this.tokens.slice(start, index + 1).map(x => x.value).join("")) }
					if (tokens.slice(start + 1, index).length > 3) { logError(ERRORMSG.TOO_MUCH_ARGUMENTS, this.tokens.slice(start, index + 1).map(x => x.value).join("")) }
					statements.push(new Statement(TokenType.ATTRIBUTE, tokens[start + 1], this.tokens[start + 3]))
					break;
				}
				case TokenType.L_CURL_BRACE: {
					const start = index;
					while (tokens[index].token !== TokenType.R_CURL_BRACE) { index++ };
					index++;
					if (index - start == 2) {
						statements.push(new Token(TokenType.SELECTOR, "*"))
					}
					const literals = tokens.slice(start, index).filter(x =>
						x.token === TokenType.LITERAL ||
						x.token === TokenType.EQUALS ||
						x.token === TokenType.STRING ||
						x.token === TokenType.INT ||
						x.token === TokenType.SEMICOLON
					)
					literals.map((_, id, arr) => {
						if (
							arr[id + 0].token === TokenType.LITERAL &&
							arr[id + 1]?.token === TokenType.EQUALS &&
							(arr[id + 2]?.token === TokenType.STRING || arr[id + 2]?.token === TokenType.INT) &&
							arr[id + 3]?.token === TokenType.SEMICOLON
						) {
							statements.push(new Statement(TokenType.SELECTOR, arr[id + 0], arr[id + 2]))
						}
						if (arr[id + 0].token === TokenType.LITERAL && arr[id + 1]?.token === TokenType.SEMICOLON) {
							statements.push(new Token(TokenType.SELECTOR, arr[id + 0].value))
						}
					})
					break;
				}
				default:
					statements.push(token)
			}
		}
		return statements
	}

	makeAST(statements: Array<Token | Statement>) {
		let AST: Class = new Class("", [], []);
		for (let index = 0; index < statements.length; index++) {
			const element = statements[index];
			switch (element.token) {
				case TokenType.CLASS: {
					if (element instanceof Token) {
						AST.name = element.value;
					} else {
						AST.name = element.value.value;
					}
					break;
				}
				case TokenType.ATTRIBUTE: {
					if (element instanceof Statement) {
						AST.attributes.push(new AttributeStatement(element.name.value, element.value.value))
					}
					break
				}
				case TokenType.SELECTOR: {
					if (element instanceof Token)
						AST.selectors.push(new SelectorStatement(element.value));
					else {
						AST.selectors.push(new SelectorStatement(element.value.value, element.name.value));
					}
					break
				}
				default:
					log("UNDEFINED", element.token)
					break;
			}
		}
		if (AST.name === "") {
			return err("No Class Found")
		}
		return ok(AST);
	}
}


(() => {
	// const tokens: Array<TOKEN> = [];
	const testData = [
		//Errors
		// [new ASTMAKER([...new Lexer('.table{')]), undefined],
		// [new ASTMAKER([...new Lexer('.table}')]), undefined],
		// [new ASTMAKER([...new Lexer('.table[{}')]), undefined],
		//
		// SELECT
		[new ASTMAKER([...new Lexer('.table2{}')]), "select * from table2;"],
		[new ASTMAKER([...new Lexer('.table2{id;data;}')]), "select id,data from table2;"],
		[new ASTMAKER([...new Lexer('.table2[attr2=332]{id;data;}')]), "select id,data from table2 where attr2=332;"],
		[new ASTMAKER([...new Lexer('.table2[attr2=332][attr="hallo"]{id;data;}')]), "select id,data from table2 where attr2=332 and attr=\"hallo\";"],

		//MultiSelect
		// [new ASTMAKER([...new Lexer('.table2[attr2=332][attr="hallo"]{id;}\n .table{}')]), "select id from table2 where attr2=332 and attr=\"hallo\";\nselect * from table;"],

		//Insert
		[new ASTMAKER([...new Lexer('.table2{id=10;}')]), "insert into table2 (id) values (10);"],
		[new ASTMAKER([...new Lexer('.table2{id="10";}')]), 'insert into table2 (id) values (10);'],

		//update
		[new ASTMAKER([...new Lexer('.table2[attr2="hello"]{id="id1";}')]), 'update table2 set id="id1" where attr="hello";'],
		[new ASTMAKER([...new Lexer('.table2[attr2=332]{id=123;}')]), 'update table2 set id=123 where attr2=332;'],

		// delete
		[new ASTMAKER([...new Lexer(':delete.table2[attr2=332][attr="hallo"]{id;}\n .table{}')]), "not Implemented yet"],

		// join
		// [new ASTMAKER([...new Lexer('#id.table1.table2[attr2=332][attr="hallo"]{id;}\n .table{}')]), "select id from table2 where attr2=332 and attr=\"hallo\";\nselect * from table;"],
		// [new ASTMAKER([...new Lexer('.table1.table2#id[attr2=332][attr="hallo"]{id;}\n .table{}')]), "select id from table2 where attr2=332 and attr=\"hallo\";\nselect * from table;"],
		// [new ASTMAKER([...new Lexer('.table1#id.table2[attr2=332][attr="hallo"]{id;}\n .table{}')]), "select id from table2 where attr2=332 and attr=\"hallo\";\nselect * from table;"],

	] as const;


	for (let i = 0; i < testData.length; i++) {
		const res = testData[i][0];
		const testres = makeStmt(res.getAst());
		log(testres)
		// if (!testres) { log(i, "\n" + testData[i][1], "\n" + res) }
	}
})()

