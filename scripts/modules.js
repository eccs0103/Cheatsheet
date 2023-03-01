"use strict";
//#region Random
/**
 * A class that manages with randomness.
 */
class Random {
	/**
	 * Gives a random number between min and max exclusively.
	 * @param {Number} min A minimum value.
	 * @param {Number} max A maximum value.
	 * @returns A random float float.
	 */
	static number(min, max) {
		return Math.random() * (max - min) + min;
	}
	/**
	 * Gives a random element from an array.
	 * @template Type Elements type.
	 * @param {Array<Type>} array Given array.
	 * @returns An array element.
	 */
	static element(array) {
		return array[Math.floor(Random.number(0, array.length))];
	}
	/**
	 * A function that returns random variant from cases.
	 * @template Type Case type.
	 * @param {Map<Type, Number>} cases Map of cases.
	 * @returns Random case.
	 */
	static case(cases) {
		const summary = Array.from(cases).reduce((previous, current) => previous + current[1], 0);
		const random = Random.number(0, summary);
		let selection = undefined;
		let start = 0;
		for (const entry of cases) {
			const end = start + entry[1];
			if (start <= random && random < end) {
				selection = entry[0];
				break;
			}
			start = end;
		}
		if (typeof (selection) == `undefined`) {
			throw new ReferenceError(`Can't select value. Maybe stack is empty.`);
		} else {
			return selection;
		}
	}
}
//#endregion
//#region Archive
/**
 * A class for convenient data storage in local storage.
 * @template Notation Data type stored in archive.
 */
class Archive {
	/**
	 * @param {String} path The path where the data should be stored.
	 * @param {Notation | undefined} initial Initial data.
	 */
	constructor(path, initial = undefined) {
		this.#path = path;
		if (localStorage.getItem(path) === null && initial !== undefined) {
			localStorage.setItem(path, JSON.stringify(initial, undefined, `\t`));
		}
	}
	/** @type {String} */ #path;
	/**
	 * The data stored in the archive.
	 */
	get data() {
		const item = localStorage.getItem(this.#path);
		if (item === null) {
			throw new ReferenceError(`Key '${this.#path}' isn't defined.`);
		}
		return (/** @type {Notation} */ (JSON.parse(item)));
	}
	/**
	 * The data stored in the archive.
	 */
	set data(value) {
		localStorage.setItem(this.#path, JSON.stringify(value, undefined, `\t`));
	}
	/**
	 * Function for receiving and transmitting data. Frequent use is not recommended based on optimization.
	 * @param {(value: Notation) => Notation} action A function that transforms the results.
	 */
	change(action) {
		this.data = action(this.data);
	}
}
//#endregion
//#region Color
/**
 * A class that represents RGB colors.
 */
class Color {
	/**
	 * Instantiating a color via HSV colors.
	 * @param {Number} hue The hue parameter.
	 * @param {Number} saturation The saturation parameter.
	 * @param {Number} value The value parameter.
	 * @returns Color instance.
	 */
	static viaHSV(hue, saturation, value) {
		/**
		 * 
		 * @param {Number} n 
		 * @param {Number} k 
		 * @returns 
		 */
		function f(n, k = (n + hue / 60) % 6) {
			return (value / 100) - (value / 100) * (saturation / 100) * Math.max(0, Math.min(k, 4 - k, 1));
		};
		return new Color(f(5) * 255, f(3) * 255, f(1) * 255);
	}
	/**
	 * Instance of a white color.
	 * @readonly
	 */
	static get white() {
		return new Color(255, 255, 255);
	}
	/**
	 * Instance of a black color.
	 * @readonly 
	 */
	static get black() {
		return new Color(0, 0, 0);
	}
	/**
	 * @param {Number} red The red parameter.
	 * @param {Number} green The green parameter.
	 * @param {Number} blue The blue parameter.
	 * @param {Number} transparence The transparence parameter.
	 */
	constructor(red, green, blue, transparence = 1) {
		this.#red = red;
		this.#green = green;
		this.#blue = blue;
		this.#transparence = transparence;
	}
	/** @type {Number} */ #red;
	/**
	 * The red property.
	 * @readonly
	 */
	get red() {
		return this.#red;
	}
	/** @type {Number} */ #green;
	/**
	 * The green property.
	 * @readonly
	 */
	get green() {
		return this.#green;
	}
	/** @type {Number} */ #blue;
	/**
	 * The blue property.
	 * @readonly
	 */
	get blue() {
		return this.#blue;
	}
	/** @type {Number} */ #transparence;
	/**
	 * The transparence property.
	 * @readonly
	 */
	get transparence() {
		return this.#transparence;
	}
	/**
	 * Converting to a string rgba(red, green, blue, transparence) of the form.
	 * @returns The result.
	 */
	toString() {
		return `rgba(${this.#red}, ${this.#green}, ${this.#blue}, ${this.#transparence})`;
	}
}
//#endregion
//#region Application
class Application {
	/** @type {String} */ static #developer = `Adaptive Core`;
	/** @readonly */ static get developer() {
		return this.#developer;
	}
	/** @type {String} */ static #project = `Cheatsheet`;
	/** @readonly */ static get project() {
		return this.#project;
	}
	static #locked = true;
	/**
	 * @param {any} exception 
	 */
	static prevent(exception) {
		if (this.#locked) {
			window.alert(exception instanceof Error ? exception.stack ?? `${exception.name}: ${exception.message}` : `Invalid exception type.`);
			location.reload();
		} else console.error(exception);
	}
}
//#endregion