"use strict";
//#region Pole
/**
 * @typedef PoleNotation
 * @property {String} question
 * @property {Number} answer
 * @property {Array<String>} cases
 */
class Pole {
	/**
	 * 
	 * @param {any} source 
	 * @returns 
	 */
	static import(source) {
		const question = (() => {
			const property = Reflect.get(source, `question`);
			if (property == undefined) {
				throw new TypeError(`Source must have a 'question' property.`);
			}
			if (typeof (property) != `string`) {
				throw new TypeError(`Source 'question' property must be a 'String' type.`);
			}
			return property;
		})();
		const answer = (() => {
			const property = Reflect.get(source, `answer`);
			if (property == undefined) {
				throw new TypeError(`Source must have a 'answer' property.`);
			}
			if (typeof (property) != `number`) {
				throw new TypeError(`Source 'answer' property must be a 'Number' type.`);
			}
			if (!Number.isFinite(property) && Number.isInteger(property)) {
				throw new TypeError(`Source 'answer' property must be a finite, integer number.`);
			}
			if (property < 0) {
				throw new TypeError(`Source 'answer' property must equal or higher than 0.`);
			}
			return property;
		})();
		const cases = (() => {
			const property = Reflect.get(source, `cases`);
			if (property == undefined) {
				throw new TypeError(`Source must have a 'cases' property.`);
			}
			if (typeof (property) == `string`) {
				return [property];
			} else if (typeof (property) == `object` && property instanceof Array) {
				return property.map((item, index) => {
					if (typeof (item) != `string`) {
						throw new TypeError(`Item with index '${index}' of source 'cases' property must be a 'String' type.`);
					} else {
						return item;
					}
				});
			} else {
				throw new TypeError(`Source 'cases' property must be a 'String | Array' type.`);
			}
		})();
		if (cases[answer] == undefined) {
			throw new TypeError(`There is no case at '${answer}' index.`);
		}
		const result = new Pole(question, answer, ...cases);
		return result;
	}
	/**
	 * 
	 * @param {Pole} source 
	 * @returns 
	 */
	static export(source) {
		const result = (/** @type {PoleNotation} */ ({}));
		result.question = source.#question;
		result.answer = source.#answer;
		result.cases = source.#cases;
		return result;
	};
	/**
	 * 
	 * @param {String} question 
	 * @param {Number} answer 
	 * @param {Array<String>} cases 
	 */
	constructor(question, answer, ...cases) {
		this.#question = question;
		this.#answer = answer;
		this.#cases = cases;
	}
	/** @type {String} */ #question;
	/** @readonly */ get question() {
		return this.#question;
	}
	/** @type {Number} */ #answer;
	/** @readonly */ get answer() {
		return this.#answer;
	}
	/** @type {Array<String>} */ #cases;
	/** @readonly */ get cases() {
		return Object.freeze(this.#cases);
	}
}
//#endregion
//#region Sheet
/**
 * @typedef SheetNotation
 * @property {String} title
 * @property {Array<PoleNotation>} poles
 */
class Sheet {
	/**
	 * 
	 * @param {any} source 
	 * @returns 
	 */
	static import(source) {
		const title = (() => {
			const property = Reflect.get(source, `title`);
			if (property == undefined) {
				throw new TypeError(`Source must have a 'title' property.`);
			}
			if (typeof (property) != `string`) {
				throw new TypeError(`Source 'title' property must be a 'String' type.`);
			}
			return property;
		})();
		const poles = (() => {
			const property = Reflect.get(source, `poles`);
			if (property == undefined) {
				throw new TypeError(`Source must have a 'poles' property.`);
			}
			if (typeof (property) == `object` && property instanceof Array) {
				return property.map((item, index) => {
					try {
						return Pole.import(item);
					} catch (error) {
						Application.prevent(error);
						throw error;
					}
				});
			} else {
				throw new TypeError(`Source 'poles' property must be a 'Array' type.`);
			}
		})();
		const result = new Sheet(title, ...poles);
		return result;
	}
	/**
	 * 
	 * @param {Sheet} source 
	 * @returns 
	 */
	static export(source) {
		const result = (/** @type {SheetNotation} */ ({}));
		result.title = source.#title;
		result.poles = source.#poles.map((notation) => Pole.export(notation));
		return result;
	}
	/**
	 * 
	 * @param {String} title 
	 * @param {Array<Pole>} poles 
	 */
	constructor(title, ...poles) {
		this.#title = title;
		this.#poles = poles;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {Array<Pole>} */ #poles;
	/** @readonly */ get poles() {
		return Object.freeze(this.#poles);
	}
}
//#endregion
//#region Program
class Program {
	//#region download()
	/**
	 * 
	 * @param {File} file 
	 */
	static download(file) {
		const aLink = document.createElement(`a`);
		aLink.download = file.name;
		aLink.href = URL.createObjectURL(file);
		aLink.click();
		URL.revokeObjectURL(aLink.href);
		aLink.remove();
	}
	//#endregion
}
//#endregion
//#region Settings
/** @enum {String} */ const ThemeType = {
	/** @readonly */ system: `system`,
	/** @readonly */ light: `light`,
	/** @readonly */ dark: `dark`,
};
/**
 * @typedef SettingsNotation
 * @property {ThemeType | undefined} theme
 * @property {Boolean | undefined} incorrectCases
 * @property {Boolean | undefined} ignoreCase
 * @property {Boolean | undefined} skipWords
*/
class Settings {
	/**
	 * 
	 * @param {SettingsNotation} source 
	 * @returns 
	 */
	static import(source) {
		const result = new Settings();
		if (source.theme !== undefined) result.theme = source.theme;
		if (source.incorrectCases !== undefined) result.incorrectCases = source.incorrectCases;
		if (source.ignoreCase !== undefined) result.ignoreCase = source.ignoreCase;
		if (source.skipWords !== undefined) result.skipWords = source.skipWords;
		return result;
	}
	/**
	 * 
	 * @param {Settings} source 
	 * @returns 
	 */
	static export(source) {
		const result = (/** @type {SettingsNotation} */ ({}));
		result.theme = source.theme;
		result.incorrectCases = source.incorrectCases;
		result.ignoreCase = source.ignoreCase;
		result.skipWords = source.skipWords;
		return result;
	}
	constructor() {
		this.theme = ThemeType.system;
		this.incorrectCases = false;
		this.ignoreCase = true;
		this.skipWords = false;
	}
	theme;
	incorrectCases;
	ignoreCase;
	skipWords;
}
//#endregion
//#region Metadata
/** @type {Archive<SettingsNotation>} */ const archiveSettings = new Archive(`${Application.developer}\\${Application.title}\\Settings`, Settings.export(new Settings()));
/** @type {Archive<Array<{ date: Number, sheet: SheetNotation }>>} */ const archiveSheets = new Archive(`${Application.developer}\\${Application.title}\\Sheets`, []);
/** @type {Archive<SheetNotation?>} */ const archiveMemory = new Archive(`${Application.developer}\\${Application.title}\\Memory`, null);
//#endregion
