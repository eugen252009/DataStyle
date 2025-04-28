export const TokenType = {
	EQUALS: "EQALS",
	NOT_EQUALS: "NOT_EQALS",
	LITERAL: "LITERAL",
	BANG: "BANG",
	INT: "INT",
	L_BRACE: "L_BRACE",
	R_BRACE: "R_BRACE",
	L_CURL_BRACE: "L_CURL_BRACE",
	R_CURL_BRACE: "R_CURL_BRACE",
	SLASH: "SLASH",
	BACK_SLASH: "BACK_SLASH",
	L_BRACKET: "L_BRACKET",
	R_BRACKET: "R_BRACKET",
	HASH: "HASH",
	INVALID: "INVALID",
	DOT: "DOT",
	CLASS: "CLASS",
	QUOTATION: "QUOTATION",
	SEMICOLON: "SEMICOLON",
	COLON: "COLON",
	DOUBLE_COLON: "DOUBLE_COLON",
	ID: "ID",
	STRING: "STRING",
	ATTRIBUTE: "ATTRIBUTE",
	SELECTOR: "SELECTOR",
	ILLEGAL: "ILLEGAL",
} as const;

export type TOKEN = Token;

export class Token {
	token: string;
	value: string;
	constructor(token: string, value: string) {
		this.token = token;
		this.value = value;
	}
}

export class Statement {
	readonly type: "Statement";
	token: string;
	name: Token;
	value: TOKEN;
	constructor(token: string, name: TOKEN, value: TOKEN) {
		this.token = token;
		this.name = name;
		this.value = value;
		this.type = "Statement"
	}
}
