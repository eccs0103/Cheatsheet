"use strict";

import { } from "./Modules/Executors.js";
import { } from "./Modules/Extensions.js";
import { } from "./Modules/Generators.js";
import { } from "./Modules/Measures.js";
import { } from "./Modules/Palette.js";
import { } from "./Modules/Storage.js";
import { } from "./Modules/Time.js";

//#region Settings
/** @enum {string} */ const Themes = {
	/** @readonly */ system: `system`,
	/** @readonly */ light: `light`,
	/** @readonly */ dark: `dark`,
};
Object.freeze(Themes);

/**
 * @typedef SettingsNotation
 * @property {Themes} [theme]
 * @property {boolean} [incorrectCases]
 * @property {boolean} [ignoreCase]
 * @property {boolean} [skipWords]
*/

class Settings {
	/**
	 * @param {unknown} source 
	 * @returns {Settings}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const theme = String.import(shell[`theme`], `property theme`);
			const incorrectCases = Boolean.import(shell[`incorrectCases`], `property incorrectCases`);
			const ignoreCase = Boolean.import(shell[`ignoreCase`], `property ignoreCase'`);
			const skipWords = Boolean.import(shell[`skipWords`], `property skipWords`);

			const result = new Settings();
			result.theme = theme;
			result.incorrectCases = incorrectCases;
			result.ignoreCase = ignoreCase;
			result.skipWords = skipWords;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns  {SettingsNotation}
	 */
	export() {
		return {
			theme: this.theme,
			incorrectCases: this.incorrectCases,
			ignoreCase: this.ignoreCase,
			skipWords: this.skipWords,
		};
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

//#region Case
/**
 * @typedef CaseNotation
 * @property {string} text
 * @property {boolean} correctness
 */

class Case {
	/**
	 * @param {unknown} source 
	 * @returns {Case}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const text = String.import(shell[`text`], `property text`);
			const correctness = Boolean.import(shell[`correctness`], `property correctness`);

			const result = new Case();
			result.text = text;
			result.correctness = correctness;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {CaseNotation}
	 */
	export() {
		return {
			text: this.text,
			correctness: this.correctness,
		};
	}
	/** @type {string} */ #text = ``;
	get text() {
		return this.#text;
	}
	set text(value) {
		this.#text = value;
	}
	/** @type {boolean} */ #correctness = false;
	get correctness() {
		return this.#correctness;
	}
	set correctness(value) {
		this.#correctness = value;
	}
}
//#endregion
//#region Poll
/**
 * @typedef PollNotation
 * @property {string} question
 * @property {CaseNotation[]} cases
 */

class Poll {
	/**
	 * @param {unknown} source 
	 * @returns {Poll}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const question = String.import(shell[`question`], `property question`);
			const cases = Array.import(shell[`cases`], Case, `property cases`);

			const result = new Poll();
			result.question = question;
			result.#cases = cases;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {PollNotation}
	 */
	export() {
		return {
			question: this.question,
			cases: this.cases.map(item => item.export()),
		};
	}
	/** @type {string} */ #question = ``;
	get question() {
		return this.#question;
	}
	set question(value) {
		this.#question = value;
	}
	/** @type {Case[]} */ #cases = [];
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

class Sheet {
	/**
	 * @param {unknown} source 
	 * @returns {Sheet}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const title = String.import(shell[`title`], `property title`);
			const polls = Array.import(shell[`polls`], Poll, `property polls`);

			const result = new Sheet();
			result.title = title;
			result.#polls = polls;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {SheetNotation}
	 */
	export() {
		return {
			title: this.title,
			polls: this.polls.map(item => item.export()),
		};
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

class Note {
	/**
	 * @param {unknown} source 
	 * @returns {Note}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const date = new Date(Number.import(shell[`date`], `property date`));
			const sheet = Sheet.import(shell[`sheet`], `property sheet`);

			const result = new Note(date, sheet);
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {NoteNotation}
	 */
	export() {
		return {
			date: this.date.valueOf(),
			sheet: this.sheet.export(),
		};
	}
	/**
	 * @param {Date} date 
	 * @param {Sheet} sheet 
	 */
	constructor(date, sheet) {
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

class Folder {
	/**
	 * @param {unknown} source 
	 * @returns {Folder}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const notes = Array.import(shell[`notes`], Note, `property notes`);

			const result = new Folder();
			result.#notes = notes;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {FolderNotation}
	 */
	export() {
		return {
			notes: this.notes.map(item => item.export())
		};
	}
	/** @type {Note[]} */ #notes = [];
	/** @readonly */ get notes() {
		return this.#notes;
	}
}
//#endregion

//#region Holder
/**
 * @typedef HolderNotation
 * @property {SheetNotation?} sheet
 */

class Holder {
	/**
	 * @param {unknown} source 
	 * @returns {Holder}
	 */
	static import(source, name = `source`) {
		try {
			const shell = Object.import(source);
			const sheet = shell[`sheet`] === null ? null : Sheet.import(shell[`sheet`], `property sheet`);

			const result = new Holder();
			result.sheet = sheet;
			return result;
		} catch (error) {
			throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: error });
		}
	}
	/**
	 * @returns {HolderNotation}
	 */
	export() {
		return {
			sheet: this.sheet === null ? null : this.sheet.export(), //TODO check
		};
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

const pathSettings = `${window.getDataPath()}.Settings`;
const pathFolder = `${window.getDataPath()}.Folder`;
const pathMemory = `${window.getDataPath()}.Memory`;
const pathConstruct = `${window.getDataPath()}.Construct`;

export { Themes, Settings, Case, Poll, Sheet, Note, Folder, Holder, pathSettings, pathFolder, pathMemory, pathConstruct };