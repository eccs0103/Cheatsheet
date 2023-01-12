"use strict";
//#region Pole
/** @typedef {{ question: String, answer: Number, cases: Array<String> }} PoleNotation */
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
/** @typedef {{ title: String, poles: Array<PoleNotation> }} SheetNotation */
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
						throw new TypeError(`Error while scaning pole with index '${index}'${error instanceof Error ? `:\n${error.message}` : `.`}`);
					}
				});
			} else {
				throw new TypeError(`Source 'poles' property must be a 'Array' type.`);
			}
		})();
		const result = new Sheet(title, ...poles);
		// const date = (() => {
		// 	const property = Reflect.get(source, `date`);
		// 	if (property == undefined) {
		// 		throw new TypeError(`Source must have a 'date' property.`);
		// 	}
		// 	if (typeof (property) != `number`) {
		// 		throw new TypeError(`Source 'date' property must be a 'Number' type.`);
		// 	}
		// 	if (!Number.isFinite(property)) {
		// 		throw new TypeError(`Source 'date' property must be a finite number.`);
		// 	}
		// 	return property;
		// })();
		// result.#date = new Date(date);
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
		// result.date = source.#date.valueOf();
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
		// this.#date = new Date();
		this.#poles = poles;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	// /** @type {Date} */ #date;
	// /** @readonly */ get date() {
	// 	return this.#date;
	// }
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
		this.hideIncorrectAnswers = true;
	}
	hideIncorrectAnswers;
}
//#endregion
//#region Metadata
const nameDeveloper = `Adaptive Core`;
const nameProject = `Cheatsheet`;
/** @typedef {{ global: Number, partial: Number , local: Number }} VersionNotation */
// const versionProject = (/** @type {VersionNotation} */ ({ "global": 0, "partial": 0, "local": 0 }));
const archiveSettings = (/** @type {Archive<SettingsNotation>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Settings`, Settings.export(new Settings()))));
const archiveSheets = (/** @type {Archive<Array<{ date: Number, sheet: SheetNotation } | SheetNotation>>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Sheets`, [])));
const archivePreview = (/** @type {Archive<SheetNotation?>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Preview`, null)));
const safeMode = true;
console.log(`Visit https://github.com/eccs0103/Cheatsheet for more information.`);
//#endregion