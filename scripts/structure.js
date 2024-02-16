"use strict";

import { } from "./Modules/Executors.js";
import { } from "./Modules/Extensions.js";
import { } from "./Modules/Generators.js";
import { } from "./Modules/Measures.js";
import { } from "./Modules/Palette.js";
import { NotationContainer, NotationProgenitor } from "./Modules/Storage.js";
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
document.documentElement.dataset[`theme`] = settings.theme;

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
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const question = (() => {
			const value = Reflect.get(source, `question`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'question' property.`);
			}
			if (typeof (value) !== `string`) {
				throw new TypeError(`Source's 'question' property must be a 'string' type`);
			}
			return value;
		})();
		const answer = (() => {
			const value = Reflect.get(source, `answer`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'answer' property.`);
			}
			if (typeof (value) !== `number`) {
				throw new TypeError(`Source's 'answer' property must be a 'number' type`);
			}
			if (!(Number.isFinite(value) && Number.isInteger(value) && value >= 0)) {
				throw new RangeError(`Source's 'answer' property must be a finite, integer number in range [0 - +∞)`);
			}
			return value;
		})();
		const cases = (() => {
			const value = Reflect.get(source, `cases`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'cases' property.`);
			}
			if (typeof (value) === `string`) {
				return [value];
			} else if (typeof (value) === `object` && value instanceof Array) {
				return value.map((item, index) => {
					if (typeof (item) !== `string`) {
						throw new TypeError(`Item with index '${index}' of source's 'cases' property must be a 'string' type`);
					}
					return item;
				});
			} else throw new TypeError(`Source's 'cases' property must be a 'string | string[]' type`);
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
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const title = (() => {
			const value = Reflect.get(source, `title`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'title' property.`);
			}
			if (typeof (value) !== `string`) {
				throw new TypeError(`Source's 'title' property must be a 'string' type.`);
			}
			return value;
		})();
		const polls = (() => {
			const value = Reflect.get(source, `polls`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'polls' property.`);
			}
			if (!(typeof (value) === `object` && value instanceof Array)) {
				throw new TypeError(`Source's 'polls' property must be a 'Poll[]' type.`);
			}
			return value.map((item, index) => {
				try {
					return Poll.import(item);
				} catch (error) {
					throw new TypeError(`Unable to import item with index '${index}' of source's 'polls' property with reason\n${Error.analyze(Error.generate(error))}`);
				}
			});
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
//#region Note
/**
 * @typedef NoteNotation
 * @property {number} date
 * @property {SheetNotation} sheet
 */

class Note extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Note}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const date = (() => {
			const value = Reflect.get(source, `date`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'date' property.`);
			}
			if (!(typeof (value) === `number`)) {
				throw new TypeError(`Property date has invalid ${typeof (value)} type`);
			}
			return new Date(value);
		})();
		const sheet = (() => {
			const value = Reflect.get(source, `sheet`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'sheet' property.`);
			}
			try {
				return Sheet.import(value);
			} catch (error) {
				throw new TypeError(`Unable to import property of source 'sheet' with reason\n${Error.analyze(Error.generate(error))}`);
			}
		})();
		const result = new Note(new Date(date), sheet);
		return result;
	}
	/**
	 * @param {Note} source 
	 * @returns {NoteNotation}
	 */
	static export(source) {
		const result = (/** @type {NoteNotation} */ ({}));
		result.date = source.#date.valueOf();
		result.sheet = Sheet.export(source.#sheet);
		return result;
	}
	/**
	 * @param {Date} date 
	 * @param {Sheet} sheet 
	 */
	constructor(date, sheet) {
		super();
		this.#date = date;
		this.#sheet = sheet;
	}
	/** @type {Date} */ #date;
	get date() {
		return this.#date;
	}
	set date(value) {
		this.#date = value;
	}
	/** @type {Sheet} */ #sheet;
	get sheet() {
		return this.#sheet;
	}
	set sheet(value) {
		this.#sheet = value;
	}
}
//#endregion
//#region Folder
/**
 * @typedef FolderNotation
 * @property {NoteNotation[]} notes
 */

class Folder extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Folder}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const notes = (() => {
			const value = Reflect.get(source, `notes`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'notes' property.`);
			}
			if (!(typeof (value) === `object` && value instanceof Array)) {
				throw new TypeError(`Source's 'notes' property must be a 'Note[]' type.`);
			}
			return value.map((item, index) => {
				try {
					return Note.import(item);
				} catch (error) {
					throw new TypeError(`Unable to import item with index '${index}' of source 'notes' with reason\n${Error.analyze(Error.generate(error))}`);
				}
			});
		})();
		const result = new Folder();
		result.#notes = notes;
		return result;
	}
	/**
	 * @param {Folder} source 
	 * @returns {FolderNotation}
	 */
	static export(source) {
		const result = (/** @type {FolderNotation} */ ({}));
		result.notes = source.notes.map(note => Note.export(note));
		return result;
	}
	/** @type {Note[]} */ #notes = [];
	/** @readonly */ get notes() {
		return this.#notes;
	}
}
//#endregion

const containerFolder = new NotationContainer(Folder, `${developer}.${title}.Folder`);
const folder = containerFolder.content;

//#region Holder
/**
 * @typedef HolderNotation
 * @property {SheetNotation?} sheet
 */

class Holder extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Holder}
	 */
	static import(source) {
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const sheet = (() => {
			const value = Reflect.get(source, `sheet`);
			if (value === undefined) {
				throw new TypeError(`Source must have a 'sheet' property.`);
			}
			try {
				if (value === null) {
					return value;
				} else {
					return Sheet.import(value);
				}
			} catch (error) {
				throw new TypeError(`Unable to import property of source 'sheet' with reason\n${Error.analyze(Error.generate(error))}`);
			}
		})();
		const result = new Holder();
		result.sheet = sheet;
		return result;
	}
	/**
	 * @param {Holder} source 
	 * @returns {HolderNotation}
	 */
	static export(source) {
		const result = (/** @type {HolderNotation} */ ({}));
		result.sheet = source.sheet ? Sheet.export(source.sheet) : null;
		return result;
	}
	/** @type {Sheet?} */ #sheet = null;
	get sheet() {
		return this.#sheet;
	}
	set sheet(value) {
		this.#sheet = value;
	}
}
//#endregion

const containerMemory = new NotationContainer(Holder, `${developer}.${title}.Memory`);
const memory = containerMemory.content;

const containerConstruct = new NotationContainer(Holder, `${developer}.${title}.Construct`);
const construct = containerConstruct.content;

export { developer, title, Themes, containerSettings, settings, Poll, Sheet, Note, Folder, containerFolder, folder, Holder, containerMemory, memory, containerConstruct, construct };