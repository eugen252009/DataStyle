//@ts-ignore
import { Token, TokenType } from "./token.cts"

export class Lexer {
	input: string;
	index: number;
	constructor(input: string) {
		this.input = input;
		this.index = 0;
	}
	_char() {
		return this.input[this.index];
	}
	_nextChar() {
		return this.input[this.index++];
	}
	_peekChar() {
		return this.input[this.index + 1];
	}
	next() {
		if (this.index >= this.input.length) return undefined;
		this.skipWhitespace();
		switch (this._char()) {
			case "=":
				return new Token(TokenType.EQALS, this._nextChar());
			case "!":
				return new Token(TokenType.BANG, this._nextChar());
			case "(":
				return new Token(TokenType.L_BRACE, this._nextChar());
			case ")":
				return new Token(TokenType.R_BRACE, this._nextChar());
			case "{":
				return new Token(TokenType.L_CURL_BRACE, this._nextChar());
			case "}":
				return new Token(TokenType.R_CURL_BRACE, this._nextChar());
			case "/":
				return new Token(TokenType.SLASH, this._nextChar());
			case "\\":
				return new Token(TokenType.BACK_SLASH, this._nextChar());
			case "[":
				return new Token(TokenType.L_BRACKET, this._nextChar());
			case "]":
				return new Token(TokenType.R_BRACKET, this._nextChar());
			case ";":
				return new Token(TokenType.SEMICOLON, this._nextChar());
			case ",":
				return new Token(TokenType.COLON, this._nextChar());
			case ":":
				{
					const firstchar = this.index;
					this._nextChar()
					if (this.isLetter()) {
						while (this.isLetter() || this.isNumerical()) { this._nextChar(); }
						return new Token(TokenType.DOUBLE_COLON, this.input.slice(firstchar + 1, this.index));
					}
					return new Token(TokenType.DOUBLE_COLON, this.input[firstchar]);
				}
			case "\"":
			case "'":
				return new Token(TokenType.QUOTATION, this._nextChar());

			case "#":
				{
					const firstchar = this.index;
					this._nextChar()
					if (this.isLetter()) {
						while (this.isLetter() || this.isNumerical()) {
							this._nextChar()
						}
						return new Token(TokenType.ID, this.input.slice(firstchar + 1, this.index));
					}
				}
				return new Token(TokenType.HASH, this._nextChar());
			case ".":
				{
					const firstchar = this.index;
					this._nextChar()
					if (this.isLetter()) {
						while (this.isLetter() || this.isNumerical()) { this._nextChar(); }
						return new Token(TokenType.CLASS, this.input.slice(firstchar + 1, this.index));
					}
					return new Token(TokenType.DOT, this.input[firstchar]);
				}
			default:
				if (this.isLetter()) {
					const firstchar = this.index;
					while (this.isLetter() || this.isNumerical()) { this._nextChar() }
					return new Token(TokenType.LITERAL, this.input.slice(firstchar, this.index));
				} else if (this.isNumerical()) {
					const firstchar = this.index;
					while (this.isNumerical()) { this._nextChar() }
					return new Token(TokenType.INT, this.input.slice(firstchar, this.index));
				}
				return new Token(TokenType.UNDEFINED, this._nextChar());
		}
	}
	skipWhitespace() {
		while (this._char() === " " || this._char() === "\t" || this._char() === "\n") {
			this._nextChar();
		}
	}
	isLetter() {
		if (this._char() >= "a" && this._char() <= "z" || this._char() >= "A" && this._char() <= "Z") return true
		return false
	}

	isNumerical() {
		if (this._char() >= "0" && this._char() <= "9") return true
		return false
	}
}




