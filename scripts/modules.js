"use strict";
//#region Random
class Random {
	//#region number()
	/**
	 * 
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns 
	 */
	static number(min, max) {
		return Math.random() * (max - min) + min;
	}
	//#endregion
	//#region element()
	/**
	 * 
	 * @template Type
	 * @param {Array<Type>} array 
	 * @returns 
	 */
	static element(array) {
		return array[Math.floor(Random.number(0, array.length))];
	}
	//#endregion
}
//#endregion
//#region Archive
/** 
 * @template Notation
 */
class Archive {
	//#region constructor()
	/**
	 * 
	 * @param {String} path 
	 * @param {Notation?} initial 
	 */
	constructor(path, initial = null) {
		this.#path = path;
		if (!localStorage.getItem(path) && initial) {
			localStorage.setItem(path, JSON.stringify(initial, undefined, `\t`));
		}
	}
	//#endregion
	//#region #path
	/** @type {String} */ #path;
	//#endregion
	//#region data
	get data() {
		const item = localStorage.getItem(this.#path);
		if (item) {
			return (/** @type {Notation} */ (JSON.parse(item)));
		} else {
			throw new ReferenceError(`Key '${this.#path}' is undefined.`);
		}
	}
	/**
	 * 
	 * @param {Notation} value 
	 */
	set data(value) {
		localStorage.setItem(this.#path, JSON.stringify(value, undefined, `\t`));
	}
	//#endregion
	//#region change()
	/**
	 * 
	 * @param {(value: Notation) => Notation} action 
	 */
	change(action) {
		this.data = action(this.data);
	}
	//#endregion
}
//#endregion
//#region Manager
class Manager {
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
//#region Program
/** @enum {Number} */ const MessageType = {
	/** @readonly */ log: 0,
	/** @readonly */ warn: 1,
	/** @readonly */ error: 2,
};
class Program {
	//#region alert()
	/**
	 * 
	 * @param {String} message 
	 * @param {MessageType} type 
	 */
	static async alert(message, type = MessageType.log) {
		const dialog = document.body.appendChild(document.createElement(`dialog`));
		dialog.classList.add(`pop-up`);
		dialog.showModal();
		{
			const h3 = dialog.appendChild(document.createElement(`h3`));
			switch (type) {
				case MessageType.log: {
					h3.innerText = `Message`;
					h3.classList.add(`highlight`);
				} break;
				case MessageType.warn: {
					h3.innerText = `Warning`;
					h3.classList.add(`warn`);
				} break;
				case MessageType.error: {
					h3.innerText = `Error`;
					h3.classList.add(`alert`);
				} break;
				default: {
					throw new TypeError(`Invalid message type.`);
				} break;
			}
			{ }
			const div = dialog.appendChild(document.createElement(`div`));
			{
				const span = div.appendChild(document.createElement(`span`));
				span.innerText = `${message}`;
				{ }
			}
			const promise = new Promise((/** @type {(value: void) => void} */ resolve) => {
				dialog.addEventListener(`click`, (event) => {
					if (event.target == dialog) {
						resolve();
						dialog.remove();
					}
				});
			});
			return promise;
		}
	}
	//#endregion
	//#region confirm()
	/**
	 * 
	 * @param {String} message 
	 * @param {MessageType} type 
	 */
	static async confirm(message, type = MessageType.log) {
		const dialog = document.body.appendChild(document.createElement(`dialog`));
		dialog.classList.add(`pop-up`);
		dialog.classList.add(`confirm`);
		dialog.showModal();
		{
			const h3 = dialog.appendChild(document.createElement(`h3`));
			switch (type) {
				case MessageType.log: {
					h3.innerText = `Message`;
					h3.classList.add(`highlight`);
				} break;
				case MessageType.warn: {
					h3.innerText = `Warning`;
					h3.classList.add(`warn`);
				} break;
				case MessageType.error: {
					h3.innerText = `Error`;
					h3.classList.add(`alert`);
				} break;
				default: {
					throw new TypeError(`Invalid message type.`);
				} break;
			}
			{ }
			const div = dialog.appendChild(document.createElement(`div`));
			{
				const span = div.appendChild(document.createElement(`span`));
				span.innerText = `${message}`;
				{ }
			}
			const buttonAccept = dialog.appendChild(document.createElement(`button`));
			buttonAccept.innerText = `Accept`;
			buttonAccept.classList.add(`highlight`);
			{ }
			const buttonDecline = dialog.appendChild(document.createElement(`button`));
			buttonDecline.innerText = `Decline`;
			buttonDecline.classList.add(`alert`);
			{ }
			const promise = new Promise((/** @type {(value: Boolean) => void} */ resolve) => {
				buttonAccept.addEventListener(`click`, (event) => {
					resolve(true);
					dialog.remove();
				});
				buttonDecline.addEventListener(`click`, (event) => {
					resolve(false);
					dialog.remove();
				});
				dialog.addEventListener(`click`, (event) => {
					if (event.target == dialog) {
						resolve(false);
						dialog.remove();
					}
				});
			});
			return promise;
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
		const dialog = document.body.appendChild(document.createElement(`dialog`));
		dialog.classList.add(`pop-up`);
		dialog.showModal();
		{
			const h3 = dialog.appendChild(document.createElement(`h3`));
			switch (type) {
				case MessageType.log: {
					h3.innerText = `Message`;
					h3.classList.add(`highlight`);
				} break;
				case MessageType.warn: {
					h3.innerText = `Warning`;
					h3.classList.add(`warn`);
				} break;
				case MessageType.error: {
					h3.innerText = `Error`;
					h3.classList.add(`alert`);
				} break;
				default: {
					throw new TypeError(`Invalid message type.`);
				} break;
			}
			{ }
			const div = dialog.appendChild(document.createElement(`div`));
			{
				const span = div.appendChild(document.createElement(`span`));
				span.innerText = `${message}`;
				{ }
			}
			const input = dialog.appendChild(document.createElement(`input`));
			input.type = `text`;
			input.placeholder = `Enter text`;
			input.inputMode = `url`;
			input.classList.add(`depth`);
			{ }
			const button = dialog.appendChild(document.createElement(`button`));
			button.innerText = `Continue`;
			{ }
			const promise = new Promise((/** @type {(value: String | null) => void} */ resolve) => {
				button.addEventListener(`click`, (event) => {
					resolve(input.value);
					dialog.remove();
				});
				dialog.addEventListener(`click`, (event) => {
					if (event.target == dialog) {
						resolve(null);
						dialog.remove();
					}
				});
			});
			return promise;
		}
	}
	//#endregion
}
//#endregion