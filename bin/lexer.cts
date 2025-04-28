//@ts-ignore
import { Token, TokenType } from "./token.cts"

export class Lexer {
	input: string;
	index: number;
	constructor(input: string) {
		this.input = input;
		this.index = 0;
	}
	hasNext() {
		return this.index < this.input.length;
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

	[Symbol.iterator] = this.nextToken;
	*nextToken() {
		while (true) {
			if (this.index >= this.input.length) return;
			this.skipWhitespace();
			switch (this._char()) {
				case "=":
					yield new Token(TokenType.EQALS, this._nextChar());
					break
				case "!":
					yield new Token(TokenType.BANG, this._nextChar());
					break
				case "(":
					yield new Token(TokenType.L_BRACE, this._nextChar());
					break
				case ")":
					yield new Token(TokenType.R_BRACE, this._nextChar());
					break
				case "{":
					yield new Token(TokenType.L_CURL_BRACE, this._nextChar());
					break
				case "}":
					yield new Token(TokenType.R_CURL_BRACE, this._nextChar());
					break
				case "/":
					yield new Token(TokenType.SLASH, this._nextChar());
					break
				case "\\":
					yield new Token(TokenType.BACK_SLASH, this._nextChar());
					break
				case "[":
					yield new Token(TokenType.L_BRACKET, this._nextChar());
					break
				case "]":
					yield new Token(TokenType.R_BRACKET, this._nextChar());
					break
				case ";":
					yield new Token(TokenType.SEMICOLON, this._nextChar());
					break
				case ",":
					yield new Token(TokenType.COLON, this._nextChar());
					break
				case ":": {
					const firstchar = this.index;
					this._nextChar()
					if (this.isLetter()) {
						while (this.isLetter() || this.isNumerical()) { this._nextChar(); }
						yield new Token(TokenType.STRING, this.input.slice(firstchar + 1, this.index));
						break
					}
					yield new Token(TokenType.DOUBLE_COLON, this.input[firstchar]);
					break
				}
				case '"':
				case "'":
					{
						const firstcharindex = this.index;
						const firstchar = this._nextChar();
						while (this.hasNext() && this._char() !== firstchar) { this._nextChar(); }
						this._nextChar()
						yield new Token(TokenType.STRING, this.input.slice(firstcharindex + 1, this.index - 1))
						break
					}
				case "#":
					{
						const firstchar = this.index;
						this._nextChar()
						if (this.isLetter()) {
							while (this.isLetter() || this.isNumerical()) {
								this._nextChar()
							}
							yield new Token(TokenType.ID, this.input.slice(firstchar + 1, this.index));
							break
						}
					}
					yield new Token(TokenType.HASH, this._nextChar());
					break
				case ".":
					{
						const firstchar = this.index;
						this._nextChar()
						if (this.isLetter()) {
							while (this.isLetter() || this.isNumerical()) { this._nextChar(); }
							yield new Token(TokenType.CLASS, this.input.slice(firstchar + 1, this.index));
							break
						}
						yield new Token(TokenType.DOT, this.input[firstchar]);
						break
					}
				default:
					if (this.isLetter()) {
						const firstchar = this.index;
						while (this.isLetter() || this.isNumerical()) { this._nextChar() }
						yield new Token(TokenType.LITERAL, this.input.slice(firstchar, this.index));
						break
					} else if (this.isNumerical()) {
						const firstchar = this.index;
						while (this.isNumerical()) { this._nextChar() }
						yield new Token(TokenType.INT, this.input.slice(firstchar, this.index));
						break
					}
					yield new Token(TokenType.INVALID, this._nextChar());
			}
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
