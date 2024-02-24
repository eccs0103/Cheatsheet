"use strict";

import { NotationContainer } from "../Scripts/Modules/Storage.js";
import { Holder, Poll, Settings, Sheet, pathMemory, pathSettings } from "../Scripts/Structure.js";

try {
	//#region Definition
	const h3SheetTitle = document.getElement(HTMLHeadingElement, `h3#sheet-title`);
	const main = document.getElement(HTMLElement, `main`);
	const inputSearchField = document.getElement(HTMLInputElement, `input#search-field`);
	//#endregion
	//#region Controller
	const settings = new NotationContainer(Settings, pathSettings).content;
	document.documentElement.dataset[`theme`] = settings.theme;
	const memory = new NotationContainer(Holder, pathMemory).content;

	class Controller {
		/**
		 * @param {Poll} poll 
		 * @returns {[HTMLDivElement, HTMLSpanElement]}
		 */
		static #constructDivPoll(poll) {
			const divPoll = document.createElement(`div`);
			divPoll.classList.add(`poll`, `layer`, `rounded`, `with-padding`, `with-inline-gap`);
			{
				var spanQuestion = divPoll.appendChild(document.createElement(`span`));
				spanQuestion.textContent = poll.question;
				{ }
				const divCases = divPoll.appendChild(document.createElement(`div`));
				divCases.classList.add(`cases`);
				{
					for (let index = 0; index < poll.cases.length; index++) {
						const $case = poll.cases[index];
						const correctness = (index === poll.answer);
						if (settings.incorrectCases || correctness) {
							const divCase = divCases.appendChild(document.createElement(`div`));
							divCase.classList.add(`case`, `with-inline-gap`);
							{
								const spanCase = divCase.appendChild(document.createElement(`span`));
								spanCase.textContent = $case;
								spanCase.classList.add(correctness ? `highlight` : `invalid`);
								{ }
							}
						}
					}
				}
			}
			return [divPoll, spanQuestion];
		}
		/**
		 * @param {Sheet} sheet 
		 */
		constructor(sheet) {
			const { title, polls } = sheet;
			this.#title = title;
			this.#promisePolls = Promise.fulfill(async () => {
				const map = new Map();
				for (const poll of polls) {
					map.set(poll, await this.#constructPoll(poll));
				}
				return map;
			});
			const flags = new Set(`g`);
			if (settings.ignoreCase) {
				flags.add(`i`);
			}
			this.#flags = Array.from(flags).join(``);
		}
		/** @type {string} */ #title;
		/** @readonly */ get title() {
			return this.#title;
		}
		/**
		 * @type {Promise<Map<Poll, [HTMLDivElement, HTMLSpanElement]>>}
		 */
		#promisePolls;
		/**
		 * @param {Poll} poll 
		 * @returns {Promise<[HTMLDivElement, HTMLSpanElement]>}
		 */
		#constructPoll(poll) {
			return Promise.fulfill(() => {
				const [divPoll, spanQuestion] = Controller.#constructDivPoll(poll);
				main.appendChild(divPoll);
				return [divPoll, spanQuestion];
			});
		}
		/**
		 * @returns {Promise<void>}
		 */
		async initialize() {
			await this.#promisePolls;
		}
		/**
		 * @type {string}
		 */
		#flags;
		/**
		 * @param {string} pattern 
		 * @returns {Promise<void>}
		 */
		async filter(pattern) {
			pattern = pattern.replace(/[-\\^$*+?.()|[\]{}]/g, `\\$&`);
			if (settings.skipWords) {
				pattern = pattern.replace(/ /g, `$&(\\S+ )*?`);
			}
			const regex = new RegExp(pattern, this.#flags);
			const polls = await this.#promisePolls;
			for (const [poll, [divPoll, spanQuestion]] of polls) {
				const test = regex.test(poll.question);
				divPoll.hidden = (Boolean(pattern) && !test);
				if (Boolean(pattern) && test) {
					spanQuestion.innerHTML = poll.question.replace(regex, (substring) => `<mark>${substring}</mark>`);
				} else if (!Boolean(pattern)) {
					spanQuestion.innerHTML = poll.question;
				}
			}
		}
	}

	const controller = new Controller(memory.sheet ?? (() => {
		throw new ReferenceError(`Unable to reach sheet`);
	})());
	//#endregion
	//#region Header
	h3SheetTitle.textContent = controller.title;
	//#endregion
	//#region Main
	await window.load(controller.initialize());
	//#endregion
	//#region Footer
	await controller.filter(inputSearchField.value);
	inputSearchField.addEventListener(`input`, async (event) => {
		try {
			await controller.filter(inputSearchField.value);
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});
	//#endregion
} catch (error) {
	await window.stabilize(Error.generate(error));
}