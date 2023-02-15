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
						throw new TypeError(`Error while scaning pole with index '${index}'${error instanceof Error ? `:\n${error.message}` : `.`}`);
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
//#region Application
/** @enum {Number} */ const MessageType = {
	/** @readonly */ log: 0,
	/** @readonly */ warn: 1,
	/** @readonly */ error: 2,
};
class Application {
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
	//#region #popup()
	/**
	 * @param {MessageType} type 
	 */
	static #popup(type) {
		const dialog = document.body.appendChild(document.createElement(`dialog`));
		dialog.classList.add(`layer`, `pop-up`);
		dialog.showModal();
		{
			const divHeader = dialog.appendChild(document.createElement(`div`));
			divHeader.classList.add(`header`, `flex`);
			{
				const h3Title = divHeader.appendChild(document.createElement(`h3`));
				switch (type) {
					case MessageType.log: {
						h3Title.innerText = `Message`;
						h3Title.classList.add(`highlight`);
					} break;
					case MessageType.warn: {
						h3Title.innerText = `Warning`;
						h3Title.classList.add(`warn`);
					} break;
					case MessageType.error: {
						h3Title.innerText = `Error`;
						h3Title.classList.add(`alert`);
					} break;
					default: throw new TypeError(`Invalid message type.`);
				}
				{ }
			}
			const divMain = dialog.appendChild(document.createElement(`div`));
			divMain.classList.add(`main`);
			{ }
			const divFooter = dialog.appendChild(document.createElement(`div`));
			divFooter.classList.add(`footer`, `flex`);
			{ }
		}
		return dialog;
	}
	//#endregion
	//#region alert()
	/**
	 * 
	 * @param {String} message 
	 * @param {MessageType} type 
	 */
	static async alert(message, type = MessageType.log) {
		const dialog = this.#popup(type);
		{
			const divMain = (/** @type {HTMLDivElement} */ (dialog.querySelector(`div.main`)));
			{
				divMain.innerText = message;
			}
			return (/** @type {Promise<void>} */ (new Promise((resolve) => {
				dialog.addEventListener(`click`, (event) => {
					if (event.target == dialog) {
						resolve();
						dialog.remove();
					}
				});
			})));
		}
	}
	//#endregion
	//#region confirm()
	/**
	 * 
	 * @param {String} message 
	 * @param {MessageType} type 
	 */
	static confirm(message, type = MessageType.log) {
		const dialog = this.#popup(type);
		{
			const divMain = (/** @type {HTMLDivElement} */ (dialog.querySelector(`div.main`)));
			{
				divMain.innerText = message;
			}
			const divFooter = (/** @type {HTMLDivElement} */ (dialog.querySelector(`div.footer`)));
			{
				const buttonAccept = divFooter.appendChild(document.createElement(`button`));
				buttonAccept.innerText = `Accept`;
				buttonAccept.classList.add(`layer`, `transparent`, `highlight`);
				{ }
				const buttonDecline = divFooter.appendChild(document.createElement(`button`));
				buttonDecline.innerText = `Decline`;
				buttonDecline.classList.add(`layer`, `transparent`, `alert`);
				{ }
				return (/** @type {Promise<Boolean>} */ (new Promise((resolve) => {
					dialog.addEventListener(`click`, (event) => {
						if (event.target == dialog) {
							resolve(false);
							dialog.remove();
						}
					});
					buttonAccept.addEventListener(`click`, (event) => {
						resolve(true);
						dialog.remove();
					});
					buttonDecline.addEventListener(`click`, (event) => {
						resolve(false);
						dialog.remove();
					});
				})));
			}
		}
	}
	//#endregion
	//#region prompt()
	/**
	 * 
	 * @param {String} message 
	 * @param {MessageType} type 
	 */
	static async prompt(message, type = MessageType.log) {
		const dialog = this.#popup(type);
		{
			const divMain = (/** @type {HTMLDivElement} */ (dialog.querySelector(`div.main`)));
			{
				divMain.innerText = message;
			}
			const divFooter = (/** @type {HTMLDivElement} */ (dialog.querySelector(`div.footer`)));
			{
				const inputPrompt = divFooter.appendChild(document.createElement(`input`));
				inputPrompt.type = `text`;
				inputPrompt.placeholder = `Enter text`;
				inputPrompt.classList.add(`depth`);
				{ }
				const buttonContinue = divFooter.appendChild(document.createElement(`button`));
				buttonContinue.innerText = `Continue`;
				buttonContinue.classList.add(`layer`, `transparent`, `highlight`);
				{ }
				return (/** @type {Promise<String?>} */ (new Promise((resolve) => {
					dialog.addEventListener(`click`, (event) => {
						if (event.target == dialog) {
							resolve(null);
							dialog.remove();
						}
					});
					buttonContinue.addEventListener(`click`, (event) => {
						resolve(inputPrompt.value);
						dialog.remove();
					});
				})));
			}
		}
	}
	//#endregion
	//#region stabilize()
	/**
	 * @param {any} exception
	 */
	static stabilize(exception) {
		if (locked) {
			Application.alert(exception instanceof Error ? exception.stack ?? `${exception.name}: ${exception.message}` : `Invalid exception type.`, MessageType.error)
				.then(() => location.reload());
		} else console.error(exception);
	}
	//#endregion
}
//#endregion
//#region Settings
/**
 * @typedef SettingsNotation
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
		result.incorrectCases = source.incorrectCases;
		result.ignoreCase = source.ignoreCase;
		result.skipWords = source.skipWords;
		return result;
	}
	constructor() {
		this.incorrectCases = false;
		this.ignoreCase = true;
		this.skipWords = false;
	}
	incorrectCases;
	ignoreCase;
	skipWords;
}
//#endregion
//#region Metadata
const nameDeveloper = `Adaptive Core`;
const nameProject = `Cheatsheet`;
const archiveSettings = (/** @type {Archive<SettingsNotation>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Settings`, Settings.export(new Settings()))));
const archiveSheets = (/** @type {Archive<Array<{ date: Number, sheet: SheetNotation }>>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Sheets`, [])));
const archivePreview = (/** @type {Archive<SheetNotation?>} */ (new Archive(`${nameDeveloper}\\${nameProject}\\Preview`, null)));
const locked = true;
//#endregion
