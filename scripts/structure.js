"use strict";

import { } from "./Modules/Executors.js";
import { } from "./Modules/Extensions.js";
import { } from "./Modules/Generators.js";
import { } from "./Modules/Measures.js";
import { } from "./Modules/Palette.js";
import { Archive, NotationContainer, NotationProgenitor } from "./Modules/Storage.js";
import { } from "./Modules/Time.js";

//#region Metadata
const developer = document.getElement(HTMLMetaElement, `meta[name="author"]`).content;
const title = document.getElement(HTMLMetaElement, `meta[name="application-name"]`).content;
//#endregion
//#region Settings
/** @enum {string} */ const Themes = {
	/** @readonly */ system: `system`,
	/** @readonly */ light: `light`,
	/** @readonly */ dark: `dark`,
};
Object.freeze(Themes);

/**
 * @typedef SettingsNotation
 * @property {boolean} [experiments]
 * @property {Themes} [theme]
 * @property {boolean} [incorrectCases]
 * @property {boolean} [ignoreCase]
 * @property {boolean} [skipWords]
*/

class Settings extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Settings}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Property source has invalid ${typeof (source)} type`);
		}
		const result = new Settings();
		const experiments = Reflect.get(source, `experiments`);
		if (experiments !== undefined) {
			if (!(typeof (experiments) === `boolean`)) {
				throw new TypeError(`Property experiments has invalid ${typeof (experiments)} type`);
			}
			result.experiments = experiments;
		}
		const theme = Reflect.get(source, `theme`);
		if (theme !== undefined) {
			if (!(typeof (theme) === `string`)) {
				throw new TypeError(`Property theme has invalid ${typeof (theme)} type`);
			}
			result.theme = theme;
		}
		const incorrectCases = Reflect.get(source, `incorrectCases`);
		if (incorrectCases !== undefined) {
			if (!(typeof (incorrectCases) === `boolean`)) {
				throw new TypeError(`Property incorrectCases has invalid ${typeof (incorrectCases)} type`);
			}
			result.incorrectCases = incorrectCases;
		}
		const ignoreCase = Reflect.get(source, `ignoreCase`);
		if (ignoreCase !== undefined) {
			if (!(typeof (ignoreCase) === `boolean`)) {
				throw new TypeError(`Property ignoreCase has invalid ${typeof (ignoreCase)} type`);
			}
			result.ignoreCase = ignoreCase;
		}
		const skipWords = Reflect.get(source, `skipWords`);
		if (skipWords !== undefined) {
			if (!(typeof (skipWords) === `boolean`)) {
				throw new TypeError(`Property skipWords has invalid ${typeof (skipWords)} type`);
			}
			result.skipWords = skipWords;
		}
		return result;
	}
	/**
	 * @param {Settings} source 
	 * @returns {SettingsNotation}
	 */
	static export(source) {
		const result = (/** @type {SettingsNotation} */ ({}));
		result.experiments = source.experiments;
		result.theme = source.theme;
		result.incorrectCases = source.incorrectCases;
		result.ignoreCase = source.ignoreCase;
		result.skipWords = source.skipWords;
		return result;
	};
	/** @type {boolean} */ #experiments = false;
	get experiments() {
		return this.#experiments;
	}
	set experiments(value) {
		this.#experiments = value;
	}
	/** @type {Themes} */ #theme = Themes.system;
	get theme() {
		return this.#theme;
	}
	set theme(value) {
		if (Object.values(Themes).includes(value)) {
			this.#theme = value;
		} else throw new TypeError(`Invalid ${value} theme`);
	}
	/** @type {boolean} */ #incorrectCases = false;
	get incorrectCases() {
		return this.#incorrectCases;
	}
	set incorrectCases(value) {
		this.#incorrectCases = value;
	}
	/** @type {boolean} */ #ignoreCase = true;
	get ignoreCase() {
		return this.#ignoreCase;
	}
	set ignoreCase(value) {
		this.#ignoreCase = value;
	}
	/** @type {boolean} */ #skipWords = false;
	get skipWords() {
		return this.#skipWords;
	}
	set skipWords(value) {
		this.#skipWords = value;
	}
}
//#endregion

const containerSettings = new NotationContainer(Settings, `${developer}.${title}.Settings`);
const settings = containerSettings.content;
/** @type {Archive<{ date: Number, sheet: SheetNotation }[]>} */ const archiveSheets = new Archive(`${developer}.${title}.Sheets`, []);
/** @type {Archive<SheetNotation?>} */ const archiveMemory = new Archive(`${developer}.${title}.Memory`, null);
/** @type {Archive<SheetNotation?>} */ const archiveConstruct = new Archive(`${developer}.${title}.Construct`, null);

//#region Poll
/**
 * @typedef PollNotation
 * @property {string} question
 * @property {number} answer
 * @property {string | string[]} cases
 */

class Poll extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Poll}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Property source has invalid ${typeof (source)} type`);
		}
		const question = (() => {
			const property = Reflect.get(source, `question`);
			if (property === undefined) {
				throw new TypeError(`Source must have a 'question' property`);
			}
			if (typeof (property) !== `string`) {
				throw new TypeError(`Source 'question' property must be a 'string' type`);
			}
			return property;
		})();
		const answer = (() => {
			const property = Reflect.get(source, `answer`);
			if (property === undefined) {
				throw new TypeError(`Source must have a 'answer' property`);
			}
			if (typeof (property) !== `number`) {
				throw new TypeError(`Source 'answer' property must be a 'number' type`);
			}
			if (!Number.isFinite(property) || !Number.isInteger(property)) {
				throw new TypeError(`Source 'answer' property must be a finite, integer number`);
			}
			if (property < 0) {
				throw new TypeError(`Source 'answer' property must equal or higher than 0`);
			}
			return property;
		})();
		const cases = (() => {
			const property = Reflect.get(source, `cases`);
			if (property === undefined) {
				throw new TypeError(`Source must have a 'cases' property`);
			}
			if (typeof (property) === `string`) {
				return [property];
			} else if (typeof (property) === `object` && property instanceof Array) {
				return property.map((item, index) => {
					if (typeof (item) !== `string`) {
						throw new TypeError(`Item with index '${index}' of source 'cases' property must be a 'string' type`);
					}
					return item;
				});
			} else {
				throw new TypeError(`Source 'cases' property must be a 'string | string[]' type`);
			}
		})();
		if (cases[answer] === undefined) {
			throw new TypeError(`There is no case at '${answer}' index`);
		}
		const result = new Poll();
		result.question = question;
		result.answer = answer;
		result.cases.push(...cases);
		return result;
	}
	/**
	 * @param {Poll} source 
	 * @returns {PollNotation}
	 */
	static export(source) {
		const result = (/** @type {PollNotation} */ ({}));
		result.question = source.question;
		result.answer = source.answer;
		result.cases = Array.from(source.cases);
		return result;
	}
	/** @type {string} */ #question = ``;
	get question() {
		return this.#question;
	}
	set question(value) {
		this.#question = value;
	}
	/** @type {number} */ #answer = 0;
	get answer() {
		return this.#answer;
	}
	set answer(value) {
		this.#answer = value;
	}
	/** @type {string[]} */ #cases = [];
	/** @readonly */ get cases() {
		return this.#cases;
	}
}
//#endregion
//#region Sheet
/**
 * @typedef SheetNotation
 * @property {string} title
 * @property {PollNotation[]} polls
 */

class Sheet extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Sheet}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Property source has invalid ${typeof (source)} type`);
		}
		const title = (() => {
			const property = Reflect.get(source, `title`);
			if (property === undefined) {
				throw new TypeError(`Source must have a 'title' property.`);
			}
			if (typeof (property) !== `string`) {
				throw new TypeError(`Source 'title' property must be a 'string' type.`);
			}
			return property;
		})();
		const polls = (() => {
			const property = Reflect.get(source, `polls`) ?? Reflect.get(source, `poles`);
			if (property === undefined) {
				throw new TypeError(`Source must have a 'polls' property.`);
			}
			if (typeof (property) === `object` && property instanceof Array) {
				return property.map((item, index) => {
					try {
						return Poll.import(item);
					} catch (error) {
						const $error = Error.generate(error);
						throw new TypeError(`Unable to import item with index '${index}' of source 'polls' with reason\n${$error.stack ?? `${$error.name}: ${$error.message}`}`);
					}
				});
			} else {
				throw new TypeError(`Source 'polls' property must be a 'Poll[]' type.`);
			}
		})();
		const result = new Sheet();
		result.title = title;
		result.polls.push(...polls);
		return result;
	}
	/**
	 * @param {Sheet} source 
	 * @returns {SheetNotation}
	 */
	static export(source) {
		const result = (/** @type {SheetNotation} */ ({}));
		result.title = source.title;
		result.polls = source.polls.map((notation) => Poll.export(notation));
		return result;
	}
	/** @type {string} */ #title = ``;
	get title() {
		return this.#title;
	}
	set title(value) {
		this.#title = value;
	}
	/** @type {Poll[]} */ #polls = [];
	/** @readonly */ get polls() {
		return this.#polls;
	}
}
//#endregion

export { Themes, containerSettings, settings, archiveSheets, archiveMemory, archiveConstruct, Poll, Sheet };