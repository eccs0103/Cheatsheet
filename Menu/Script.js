"use strict";

import { NotationContainer } from "../Scripts/Modules/Storage.js";
import { Folder, Holder, Note, Settings, Sheet, pathFolder, pathMemory, pathSettings } from "../Scripts/Structure.js";

try {
	//#region Definition
	const header = document.getElement(HTMLElement, `header`);
	const inputToggleMarkAll = header.getElement(HTMLInputElement, `input#toggle-mark-all`);
	const inputToggleEditMode = header.getElement(HTMLInputElement, `input#toggle-edit-mode`);
	const main = document.getElement(HTMLElement, `main`);
	const buttonOpenAddDialog = main.getElement(HTMLButtonElement, `button#open-add-dialog`);
	const buttonOpenActionsDialog = main.getElement(HTMLButtonElement, `button#open-actions-dialog`);
	const dialogAddSheet = document.getElement(HTMLDialogElement, `dialog#add-sheet`);
	const inputUploadFromDevice = dialogAddSheet.getElement(HTMLInputElement, `input#upload-from-device`);
	const buttonImportFromCloud = dialogAddSheet.getElement(HTMLButtonElement, `button#import-from-cloud`);
	const dialogSheetActions = document.getElement(HTMLDialogElement, `dialog#sheet-actions`);
	const buttonDownloadSelection = dialogSheetActions.getElement(HTMLButtonElement, `button#download-selection`);
	const buttonShareSelection = dialogSheetActions.getElement(HTMLButtonElement, `button#share-selection`);
	const buttonDeleteSelection = dialogSheetActions.getElement(HTMLButtonElement, `button#delete-selection`);
	//#endregion
	//#region Controller
	const settings = new NotationContainer(Settings, pathSettings).content;
	document.documentElement.dataset[`theme`] = settings.theme;
	const memory = new NotationContainer(Holder, pathMemory).content;
	const notes = new NotationContainer(Folder, pathFolder).content.notes;

	class Controller {
		/**
		 * @param {Note} note 
		 * @returns {[HTMLDivElement, HTMLInputElement, HTMLLabelElement]}
		 */
		static #constructDivNote(note) {
			const divNote = document.createElement(`div`);
			divNote.role = `button`;
			divNote.classList.add(`sheet-row`, `layer`, `rounded`);
			{
				const divSheetPrimary = divNote.appendChild(document.createElement(`div`));
				divSheetPrimary.classList.add(`sheet-primary`);
				{
					var inputToggleMark = divSheetPrimary.appendChild(document.createElement(`input`));
					inputToggleMark.id = `toggle-mark-`;
					inputToggleMark.type = `checkbox`;
					inputToggleMark.hidden = true;
					divNote.addEventListener(`click`, (event) => {
						if (inputToggleEditMode.checked) {
							//TODO check
						} else {
							memory.sheet = note.sheet;
							location.assign(`../Finder`);
						}
					});
					{ }
					var labelToggleMark = divSheetPrimary.appendChild(document.createElement(`label`));
					labelToggleMark.htmlFor = inputToggleMark.id;
					labelToggleMark.classList.add(`with-padding`, `flex`, `secondary-centered`, `with-gap`);
					{
						const imgIcon = labelToggleMark.appendChild(document.createElement(`img`));
						imgIcon.src = `../Resources/Checkbox.png`;
						imgIcon.alt = `Mark`;
						imgIcon.classList.add(`icon`);
					}
					const pictureSheetIcon = divSheetPrimary.appendChild(document.createElement(`picture`));
					pictureSheetIcon.classList.add(`sheet-icon`, `with-padding`);
					{
						const imgIcon = pictureSheetIcon.appendChild(document.createElement(`img`));
						imgIcon.src = `../Resources/Document.png`;
						imgIcon.alt = `Sheet`;
						imgIcon.classList.add(`icon`);
					}
					const spanSheetTitle = divSheetPrimary.appendChild(document.createElement(`span`));
					spanSheetTitle.classList.add(`sheet-title`);
					spanSheetTitle.textContent = note.sheet.title;
					{ }
					const timeSheetDate = divSheetPrimary.appendChild(document.createElement(`time`));
					timeSheetDate.dateTime = note.date.toISOString();
					timeSheetDate.classList.add(`sheet-date`);
					timeSheetDate.textContent = note.date.toLocaleString();
					{ }
				}
				/* const divSheetSecondary = divNote.appendChild(document.createElement(`div`));
				divSheetSecondary.classList.add(`sheet-secondary`, `rounded`, `in-left`, `with-padding`);
				{
					const imgIcon = divSheetSecondary.appendChild(document.createElement(`img`));
					imgIcon.src = `../Resources/More.png`;
					imgIcon.alt = `Actions`;
					imgIcon.classList.add(`icon`);
				} */
			}
			return [divNote, inputToggleMark, labelToggleMark];
		}
		/**
		 * @type {Map<Note, HTMLDivElement>}
		 */
		#mapNotes = new Map();
		/** @readonly */ get constructs() {
			return this.#mapNotes.values();
		}
		/**
		 * @type {Map<HTMLDivElement, HTMLInputElement>}
		 */
		#mapConstucts = new Map();
		/** @readonly */ get toggles() {
			return this.#mapConstucts.values();
		}
		/**
		 * @type {Map<HTMLInputElement, HTMLLabelElement>}
		 */
		#mapToggles = new Map();
		/** @readonly */ get labels() {
			return this.#mapToggles.values();
		}
		/**
		 * @param {Note} note 
		 * @returns {Promise<void>}
		 */
		#constructNote(note) {
			return Promise.fulfill(() => {
				const [divNote, inputToggleMark, labelToggleMark] = Controller.#constructDivNote(note);
				inputToggleMark.id = `toggle-mark-${this.#mapNotes.size}`;
				inputToggleMark.addEventListener(`change`, (event) => {
					inputToggleMarkAll.checked = Array.from(this.#mapConstucts).every(([, inputToggleMark]) => inputToggleMark.checked);
				});
				labelToggleMark.htmlFor = inputToggleMark.id;
				this.#mapNotes.set(note, divNote);
				this.#mapConstucts.set(divNote, inputToggleMark);
				this.#mapToggles.set(inputToggleMark, labelToggleMark);
				main.insertBefore(divNote, main.firstChild);
			});
		}
		/**
		 * @param {Note} note 
		 * @returns {Promise<void>}
		 */
		#destructNote(note) {
			return Promise.fulfill(() => {
				const divNote = this.#mapNotes.get(note) ?? (() => {
					throw new ReferenceError(`Unable to find note ${note}`);
				})();
				const inputToggleMark = this.#mapConstucts.get(divNote) ?? (() => {
					throw new ReferenceError(`Unable to find toggle ${note}`);
				})();
				main.removeChild(divNote);
				this.#mapToggles.delete(inputToggleMark);
				this.#mapConstucts.delete(divNote);
				this.#mapNotes.delete(note);
			});
		}
		/**
		 * @param {Note} note 
		 * @returns {Promise<void>}
		 */
		async addNote(note) {
			notes.push(note);
			await this.#constructNote(note);
		};
		/**
		 * @param {Note[]} notes 
		 * @returns {Promise<void>}
		 */
		async addNotes(...notes) {
			for (const note of notes) {
				await this.#constructNote(note);
			}
		};
		/**
		 * @param {number} index
		 * @returns {Promise<void>}
		 */
		async removeNote(index) {
			const [note] = notes.splice(index, 1);
			await this.#destructNote(note);
		};
		/**
		 * @param {number[]} indexes
		 * @returns {Promise<void>}
		 */
		async removeNotes(...indexes) {
			for (let index = 0; index < indexes.length; index++) {
				const current = indexes[index];
				await this.removeNote(current - index);
				for (let index2 = current - index; index2 < this.#mapNotes.size; index2++) {
					const note = notes[index2];
					const divNote = this.#mapNotes.get(note) ?? (() => {
						throw new ReferenceError(`Unable to reach construct at index ${index2}`);
					})();
					const inputToggleMark = this.#mapConstucts.get(divNote) ?? (() => {
						throw new ReferenceError(`Unable to reach toggle at index ${index2}`);
					})();
					const labelToggleMark = this.#mapToggles.get(inputToggleMark) ?? (() => {
						throw new ReferenceError(`Unable to reach label at index ${index2}`);
					})();
					inputToggleMark.id = `toggle-mark-${index2}`;
					labelToggleMark.htmlFor = inputToggleMark.id;
				}
			}
		};
		/**
		 * @returns {number[]}
		 */
		getSelection() {
			const indexes = [];
			let index = 0;
			for (const [, inputToggleMark] of this.#mapConstucts) {
				if (inputToggleMark.checked) {
					indexes.push(index);
				}
				index++;
			}
			return indexes;
		}
	}

	const controller = new Controller();
	//#endregion
	//#region Header
	inputToggleMarkAll.addEventListener(`change`, (event) => {
		for (const inputToggleMark of controller.toggles) {
			inputToggleMark.checked = inputToggleMarkAll.checked;
		}
	});
	inputToggleEditMode.addEventListener(`change`, (event) => {
		for (const inputToggleMark of controller.toggles) {
			inputToggleMark.checked = false;
		}
	});
	//#endregion
	//#region Main
	await controller.addNotes(...notes);
	//#endregion
	//#region Add sheet
	buttonOpenAddDialog.addEventListener(`click`, (event) => {
		dialogAddSheet.showModal();
	});

	dialogAddSheet.addEventListener(`click`, (event) => {
		if (event.target === dialogAddSheet) {
			dialogAddSheet.close();
		}
	});

	inputUploadFromDevice.addEventListener(`click`, (event) => {
		inputUploadFromDevice.value = ``;
	});
	inputUploadFromDevice.addEventListener(`change`, async (event) => {
		try {
			const files = inputUploadFromDevice.files ?? (() => {
				throw new ReferenceError(`Unable to reach file list`);
			})();
			for (const file of files) {
				const sheet = Sheet.import(JSON.parse(await file.text()));
				const note = new Note(new Date(), sheet);
				await controller.addNote(note);
				dialogAddSheet.close();
			}
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});

	buttonImportFromCloud.addEventListener(`click`, async (event) => {
		try {
			const input = await window.promptAsync(`Enter the download link. You will also need a stable connection before the download is complete.`);
			if (input !== null) {
				const sheet = Sheet.import(await ((await window.load(fetch(input), 200, 500)).json()));
				const note = new Note(new Date(), sheet);
				await controller.addNote(note);
				dialogAddSheet.close();
			}
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});
	//#endregion
	//#region Sheet actions
	buttonOpenActionsDialog.addEventListener(`click`, (event) => {
		dialogSheetActions.showModal();
	});

	dialogSheetActions.addEventListener(`click`, (event) => {
		if (event.target === dialogSheetActions) {
			dialogSheetActions.close();
		}
	});

	buttonDownloadSelection.addEventListener(`click`, async (event) => {
		try {
			const selection = controller.getSelection();
			for (const current of selection) {
				const sheet = notes[current].sheet;
				navigator.download(new File([JSON.stringify(Sheet.export(sheet))], `${sheet.title}.json`));
			}
			dialogSheetActions.close();
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});

	buttonShareSelection.addEventListener(`click`, async (event) => {
		try {
			const selection = controller.getSelection();
			await navigator.share({
				files: selection.map((current) => {
					const sheet = notes[current].sheet;
					return new File([JSON.stringify(Sheet.export(sheet))], `${sheet.title}.json`);
				}),
				text: `Sharing with you ${notes.length} sheet(s). Use them in ${location.origin}${location.pathname}.`,
				url: `${location.origin}${location.pathname}`,
			});
			dialogSheetActions.close();
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});

	buttonDeleteSelection.addEventListener(`click`, async (event) => {
		try {
			const selection = controller.getSelection();
			if (await window.confirmAsync(`Sure about to delete ${selection.length} sheet(s)?`)) {
				await controller.removeNotes(...selection);
				if (Array.from(controller.constructs).length === 0) {
					inputToggleEditMode.checked = false;
				}
				dialogSheetActions.close();
			}
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});
	//#endregion
} catch (error) {
	await window.stabilize(Error.generate(error));
}