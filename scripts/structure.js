`use strict`;
//#region Pole
/** @typedef {{ question: String, answer: Number, cases: Array<String> }} PoleNotation */
class Pole {
	/**
	 * 
	 * @param {PoleNotation} source 
	 * @returns 
	 */
	static import(source) {
		const result = new Pole(
			source.question,
			source.answer,
			...source.cases
		);
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
	}
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
/** @typedef {{ title: String, date: Number, poles: Array<PoleNotation> }} SheetNotation */
class Sheet {
	/**
	 * 
	 * @param {any} source 
	 */
	static parse(source) {
		/**
		 * 
		 * @param {any} property 
		 * @param {`number` | `string` | `object` | `array`} type 
		 * @param {any?} value
		 */
		function tryParse(property, type, value = null) {
			const condition = type == `array` ? property instanceof Array : typeof (property) == type;
			if (property != null || property != undefined && condition) {
				return value ?? property;
			} else {
				throw new TypeError(`Invalid structure.`);
			}
		}

		const result = (/** @type {SheetNotation} */(tryParse(source, `object`, {})));
		{
			result.title = tryParse(source.title, `string`);
			result.date = tryParse(source.date, `number`);
			result.poles = tryParse(source.poles, `array`, []);
			for (let index = 0; index < source.poles.length; index++) {
				result.poles[index] = tryParse(source.poles[index], `object`, {});
				{
					result.poles[index].question = tryParse(source.poles[index].question, `string`);
					result.poles[index].answer = tryParse(source.poles[index].answer, `number`);
					result.poles[index].cases = tryParse(source.poles[index].cases, `array`, []);
					for (let index2 = 0; index2 < source.poles[index].cases.length; index2++) {
						result.poles[index].cases[index2] = tryParse(source.poles[index].cases[index2], `string`);
					}
				}
			}
		}
		return result;
	}
	/**
	 * 
	 * @param {SheetNotation} source 
	 * @returns 
	 */
	static import(source) {
		const result = new Sheet(
			source.title,
			...source.poles.map((pole) => Pole.import(pole))
		);
		result.#date = new Date(source.date);
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
		result.date = source.#date.valueOf();
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
		this.#date = new Date();
		this.#poles = poles;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {Date} */ #date;
	/** @readonly */ get date() {
		return this.#date;
	}
	/** @type {Array<Pole>} */ #poles;
	/** @readonly */ get poles() {
		return Object.freeze(this.#poles);
	}
}
//#endregion
//#region Settings
/** @typedef {{ hideIncorrectAnswers: Boolean }} SettingsNotation */
class Settings {
	/**
	 * 
	 * @param {SettingsNotation} source 
	 * @returns 
	 */
	static import(source) {
		const result = new Settings();
		result.hideIncorrectAnswers = source.hideIncorrectAnswers;
		return result;
	}
	/**
	 * 
	 * @param {Settings} source 
	 * @returns 
	 */
	static export(source) {
		const result = (/** @type {SettingsNotation} */ ({}));
		result.hideIncorrectAnswers = source.hideIncorrectAnswers;
		return result;
	}
	constructor() {
		this.hideIncorrectAnswers = false;
	}
	hideIncorrectAnswers;
}
//#endregion
//#region Metadata
const nameDeveloper = `Adaptive Core`;
const nameProject = `Cheatsheet`;
/** @typedef {{ global: Number, partial: Number , local: Number }} VersionNotation */
// const versionProject = (/** @type {VersionNotation} */ ({ "global": 0, "partial": 0, "local": 0 }));
const archiveSettings = new Archive(`${nameDeveloper}\\${nameProject}\\Settings`, Settings.export(new Settings()));
const archiveSheets = new Archive(`${nameDeveloper}\\${nameProject}\\Sheets`, (/** @type {Array<SheetNotation>} */ ([])));
const archivePreview = (/** @type {Archive<SheetNotation?>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Preview`, null)));
const safeMode = true;
//#endregion