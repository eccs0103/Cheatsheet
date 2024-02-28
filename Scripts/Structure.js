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
			const result = new Case();
			result.text = String.import(shell[`text`], `property text`);
			result.correctness = Boolean.import(shell[`correctness`], `property correctness`);
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
	/**
	 * @param {string} text 
	 * @param {boolean} correctness 
	 */
	constructor(text = ``, correctness = false) {
		this.#text = text;
		this.#correctness = correctness;
	}
	/** @type {string} */ #text;
	get text() {
		return this.#text;
	}
	set text(value) {
		this.#text = value;
	}
	/** @type {boolean} */ #correctness;
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
	static #import1(source, name = `source`) {
		const shell = Object.import(source);
		const result = new Poll();
		result.question = String.import(shell[`question`], `property question`);
		result.#cases = Array.import(shell[`cases`], `property cases`)
			.map((item, index) => Case.import(item, `property cases[${(index)}]`));
		return result;
	}
	/**
	 * @param {unknown} source 
	 * @returns {Poll}
	 */
	static #import2(source, name = `source`) {
		const shell = Object.import(source);
		const result = new Poll();
		result.question = String.import(shell[`question`], `property question`);
		const answer = Number.import(shell[`answer`], `property answer`);
		result.#cases = Array.import(shell[`cases`], `property cases`)
			.map((item, index) => new Case(String.import(item, `property cases[${(index)}]`), index === answer));
		return result;
	}
	/**
	 * @param {unknown} source 
	 * @returns {Poll}
	 */
	static #import3(source, name = `source`) {
		const shell = Object.import(source);
		const result = new Poll();
		const answer = Number.import(shell[`answer`], `property answer`);
		result.question = String.import(shell[`question`], `property question`);
		result.cases.push(new Case(String.import(shell[`cases`], `property cases`), (0 === answer)));
		return result;
	}
	/**
	 * @param {unknown} source 
	 * @param {string} name 
	 * @returns {Poll}
	 */
	static import(source, name = `source`) {
		let cause;
		for (const method of [Poll.#import1, Poll.#import2, Poll.#import3]) {
			try {
				return method(source, name);
			} catch (error) {
				cause = error;
				continue;
			}
		}
		throw new TypeError(`Unable to import ${(name)} due it's ${typename(source)} type`, { cause: cause });
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
			const result = new Sheet();
			result.title = String.import(shell[`title`], `property title`);
			result.#polls = Array.import(shell[`polls`], `property polls`)
				.map((item, index) => Poll.import(item, `property polls[${(index)}]`));
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
			const result = new Note(
				new Date(Number.import(shell[`date`], `property date`)),
				Sheet.import(shell[`sheet`], `property sheet`)
			);
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
			const result = new Folder();
			result.#notes = Array.import(shell[`notes`], `property notes`)
				.map((item, index) => Note.import(item, `property notes[${(index)}]`));
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
			const result = new Holder();
			result.sheet = shell[`sheet`] === null ? null : Sheet.import(shell[`sheet`], `property sheet`);
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

const pathData = window.getDataPath();
const pathSettings = `${pathData}.Settings`;
const pathFolder = `${pathData}.Folder`;
const pathMemory = `${pathData}.Memory`;
const pathConstruct = `${pathData}.Construct`;

export { Themes, Settings, Case, Poll, Sheet, Note, Folder, Holder, pathSettings, pathFolder, pathMemory, pathConstruct };