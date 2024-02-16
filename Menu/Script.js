"use strict";

import { Note, Sheet, folder, memory } from "../Scripts/Structure.js";

try {
	//#region Definition
	const inputToggleMarkAll = document.getElement(HTMLInputElement, `input#toggle-mark-all`);
	const inputToggleEditMode = document.getElement(HTMLInputElement, `input#toggle-edit-mode`);
	const main = document.getElement(HTMLElement, `main`);
	const buttonOpenAddDialog = document.getElement(HTMLButtonElement, `button#open-add-dialog`);
	const dialogAddSheet = document.getElement(HTMLDialogElement, `dialog#add-sheet`);
	const inputUploadFromDevice = document.getElement(HTMLInputElement, `input#upload-from-device`);
	const buttonImportFromCloud = document.getElement(HTMLButtonElement, `button#import-from-cloud`);
	const buttonOpenActionsDialog = document.getElement(HTMLButtonElement, `button#open-actions-dialog`);
	const dialogSheetActions = document.getElement(HTMLDialogElement, `dialog#sheet-actions`);
	const buttonDownloadSelection = document.getElement(HTMLButtonElement, `button#download-selection`);
	const buttonShareSelection = document.getElement(HTMLButtonElement, `button#share-selection`);
	const buttonDeleteSelection = document.getElement(HTMLButtonElement, `button#delete-selection`);
	//#endregion
	//#region Header
	let isEditMode = false;
	/** 
	 * @type {HTMLInputElement[]} 
	 */
	const listToggleMarks = [];
	inputToggleMarkAll.addEventListener(`change`, (event) => {
		for (const toggle of listToggleMarks) {
			toggle.checked = inputToggleMarkAll.checked;
		}
	});
	inputToggleEditMode.addEventListener(`change`, (event) => {
		isEditMode = inputToggleEditMode.checked;
		for (const toggle of listToggleMarks) {
			toggle.checked = false;
		}
	});
	//#endregion
	//#region Main
	//#region Div note
	//#region Div note constructor
	/**
	 * @param {Note} note 
	 * @returns {HTMLDivElement}
	 */
	function divNoteConstructor(note) {
		const divNote = document.createElement(`div`);
		divNote.role = `button`;
		divNote.classList.add(`sheet-row`, `layer`, `rounded`);
		{
			const divSheetPrimary = divNote.appendChild(document.createElement(`div`));
			divSheetPrimary.classList.add(`sheet-primary`);
			{
				const inputToggleMark = divSheetPrimary.appendChild(document.createElement(`input`));
				inputToggleMark.id = `toggle-mark-${listToggleMarks.length}`;
				inputToggleMark.type = `checkbox`;
				inputToggleMark.hidden = true;
				listToggleMarks.push(inputToggleMark);
				inputToggleMark.addEventListener(`change`, (event) => {
					inputToggleMarkAll.checked = listToggleMarks.every(mark => mark.checked);
				});
				divNote.addEventListener(`click`, (event) => {
					if (isEditMode) {
						//TODO check
					} else {
						memory.sheet = note.sheet;
						location.assign(`../Finder`);
					}
				});
				{ }
				const labelToggleMark = divSheetPrimary.appendChild(document.createElement(`label`));
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
		return divNote;
	};
	//#endregion
	//#region Get selection indexes
	/**
	 * @returns {number[]}
	 */
	function getSelectionIndexes() {
		/**
		 * @type {number[]}
		 */
		const indexes = [];
		for (let index = 0; index < listToggleMarks.length; index++) {
			const toggle = listToggleMarks[index];
			if (toggle.checked) {
				indexes.push(index);
			}
		}
		return indexes;
	}
	//#endregion
	//#endregion

	for (const note of folder.notes) {
		main.insertBefore(divNoteConstructor(note), main.firstChild);
	}

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
				folder.notes.push(note);
				main.insertBefore(divNoteConstructor(note), main.firstChild);
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
				folder.notes.push(note);
				main.insertBefore(divNoteConstructor(note), main.firstChild);
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
			const selection = getSelectionIndexes();
			const notes = folder.notes;
			for (const index of selection) {
				const { sheet } = notes[index];
				navigator.download(new File([JSON.stringify(Sheet.export(sheet))], `${sheet.title}.json`));
			}
			dialogSheetActions.close();
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});

	buttonShareSelection.addEventListener(`click`, async (event) => {
		try {
			const selection = getSelectionIndexes();
			const notes = folder.notes;
			await navigator.share({
				files: selection.map((index) => {
					const sheet = notes[index].sheet;
					return new File([JSON.stringify(Sheet.export(sheet))], `${sheet.title}.json`);
				}),
				// title: ,
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
			const selection = getSelectionIndexes();
			const notes = folder.notes;
			const divNotes = main.getElements(HTMLDivElement, `div.sheet-row`);
			for (let counter = 0; counter < selection.length; counter++) {
				const index = selection[counter];
				divNotes.item(divNotes.length - 1 - index).remove();
				for (let counter2 = index + 1; counter2 < divNotes.length; counter2++) {
					const divNote = divNotes.item(divNotes.length - 1 - counter2);
					const inputToggleMark = divNote.getElement(HTMLInputElement, `input[id^="toggle-mark"]`);
					inputToggleMark.id = `toggle-mark-${counter2 - counter - 1}`;
					divNote.getElement(HTMLLabelElement, `label[for^="toggle-mark"]`).htmlFor = inputToggleMark.id;
				}
				notes.splice(index - counter, 1);
			}
			dialogSheetActions.close();
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});
	//#endregion
	//#endregion
} catch (error) {
	await window.stabilize(Error.generate(error));
}