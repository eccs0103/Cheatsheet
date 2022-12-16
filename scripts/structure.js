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
/** @typedef {{ title: String, poles: Array<PoleNotation> }} SheetNotation */
class Sheet {
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
const safeMode = true;
//#endregion