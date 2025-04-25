export const TokenType = {
	EQALS: "EQALS",
	NOT_EQALS: "NOT_EQALS",
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
	UNDEFINED: "UNDEFINED",
	DOT: "DOT",
	CLASS: "CLASS",
	QUOTATION: "QUOTATION",
	SEMICOLON: "SEMICOLON",
	COLON: "COLON",
	DOUBLE_COLON: "DOUBLE_COLON",
	ID: "ID",
} as const;


export class Token {
	token: string;
	value: string | undefined;
	constructor(token: string, value?: string) {
		this.token = token;
		this.value = value;
	}
}
