export const ERRORMSG = {
	TODO: "TODO",
	WRONG_STRUCTURE: "Your Structure is Wrong",
	CLASS_NOT_FOUND: "CANT FIND YOUR CLASS",
	NOT_ENOUGH_ARGUMENTS: "Not Enough Arguments",
	TOO_MUCH_ARGUMENTS: "Too Much Arguments",
	INFINITE_LOOP: "THERE IS AN INFINITE LOOP GOING ON!",
} as const;
export const logError = (...msg: string[] | any[]) => { console.error(...msg); }
type ResultType<T, E> = Ok<T> | Err<E>;
class Ok<T> {
	readonly ok = true;
	readonly value: T;

	constructor(value: T) {
		this.value = value;
	}
	isOk(): this is Ok<T> { return true; }
	isErr(): this is Err<never> { return false; }
	get(): T { return this.value; };
	expect(_msg: string): T { return this.value; }
	match<U>(okFn: (value: T) => U, _errFn: (error: never) => U): U { return okFn(this.value); }
}

class Err<E> {
	readonly ok = false;
	readonly error: E;

	constructor(error: E) {
		this.error = error;
	}
	isOk(): this is Ok<never> { return false; }
	isErr(): this is Err<E> { return true; }
	get(): E { return this.error; };
	expect(msg: string): never { throw new Error(`${msg}: ${this.error}`); }
	match<U>(_okFn: (value: never) => U, errFn: (error: E) => U): U { return errFn(this.error); }
}

// Hilfsfunktionen
export function ok<T>(value: T): Ok<T> { return new Ok(value); }
export function err<E>(error: E): Err<E> { return new Err(error); }

