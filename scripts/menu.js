"use strict";
try {
	//#region Converting to a new version
	archiveSheets.change((data) => data.map((item) => {
		try {
			const sheet = Sheet.import(item);
			Application.alert(`Found sheet '${sheet.title}' with old data format. The old formats are no longer supported, so tey will be converted to the new one.`, MessageType.warn);
			return { date: Date.now(), sheet: Sheet.export(sheet) };
		} catch (error) {
			return item;
		}
	}));
	//#endregion
	//#region Initialize
	const settings = Settings.import(archiveSettings.data);
	document.documentElement.dataset[`theme`] = settings.theme;

	const inputAllSheetsMark = (/** @type {HTMLInputElement} */ (document.querySelector(`input#all-sheets-mark`)));
	inputAllSheetsMark.addEventListener(`change`, (event) => {
		marks.forEach((mark) => mark.checked = inputAllSheetsMark.checked);
	});

	const templateSheetContainerPrototype = (/** @type {HTMLTemplateElement} */ (document.querySelector(`template#sheet-container-prototype`)));
	const container = (() => {
		if (!templateSheetContainerPrototype.parentElement) {
			throw new ReferenceError(`Element 'container' isn't defined.`);
		} else {
			return templateSheetContainerPrototype.parentElement;
		}
	})();

	let marks = (/** @type {Array<HTMLInputElement>} */ ([]));
	function selection() {
		return marks.reduce((list, mark, index) => (mark.checked ? [...list, index] : list), (/** @type {Array<Number>} */ ([])));;
	}
	const inputEditSheets = (/** @type {HTMLInputElement} */ (document.querySelector(`input#edit-sheets`)));
	inputEditSheets.addEventListener(`change`, (event) => {
		const imgIcon = (/** @type {HTMLImageElement} */ (buttonMainAction.querySelector(`img.icon`)));
		imgIcon.src = inputEditSheets.checked ? `../resources/menu.png` : `../resources/add.png`;
		[inputAllSheetsMark, ...marks].map((mark) => {
			if (!inputEditSheets.checked) {
				mark.checked = false;
			}
			return (/** @type {HTMLLabelElement} */ (document.querySelector(`label[for="${mark.id}"]`)));
		}).forEach((label) => {
			label.hidden = !inputEditSheets.checked;
		});
	});

	let database = archiveSheets.data.map(({ date, sheet }) => ({ date: new Date(date), sheet: Sheet.import(sheet) }));

	//#region Configuration
	function configureSheets() {
		container.querySelectorAll(`div.-sheet-container`).forEach(element => {
			element.remove();
		});
		marks = database.map(({ date, sheet }, index) => {
			const divSheetContainer = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetContainerPrototype.content.cloneNode(true))).querySelector(`div.-sheet-container`))));
			{
				const inputSheetMark = (/** @type {HTMLInputElement} */ (divSheetContainer.querySelector(`input#sheet-mark`)));
				inputSheetMark.id = `sheet-mark-${index}`;
				inputSheetMark.addEventListener(`change`, (event) => {
					const indexes = selection();
					inputAllSheetsMark.checked = (indexes.length == marks.length);
				});
				const labelSheetMark = (/** @type {HTMLLabelElement} */ (divSheetContainer.querySelector(`label[for="sheet-mark"]`)));
				labelSheetMark.htmlFor = inputSheetMark.id;
				labelSheetMark.hidden = !inputEditSheets.checked;
				{ }
				const buttonSheetInformation = (/** @type {HTMLButtonElement} */ (divSheetContainer.querySelector(`button.-sheet-information`)));
				buttonSheetInformation.addEventListener(`click`, (event) => {
					archiveMemory.data = Sheet.export(sheet);
					location.href = `./search-engine.html`;
				});
				{
					const spanSheetTitle = (/** @type {HTMLSpanElement} */ (divSheetContainer.querySelector(`span.-sheet-title`)));
					spanSheetTitle.innerText = sheet.title;
					{ }
					const timeSheetDate = (/** @type {HTMLTimeElement} */ (divSheetContainer.querySelector(`time.-sheet-date`)));
					timeSheetDate.dateTime = date.toString();
					timeSheetDate.innerText = date.toLocaleString();
					{ }
				}
				return inputSheetMark;
			}
		});
	}
	//#endregion

	configureSheets();

	const buttonMainAction = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#main-action`)));
	buttonMainAction.addEventListener(`click`, () => {
		if (inputEditSheets.checked) {
			dialogMoreActions.showModal();
			dialogMoreActions.addEventListener(`click`, (event) => {
				if (event.target == dialogMoreActions) {
					dialogMoreActions.close();
				}
			});
		} else {
			dialogInsertSheet.showModal();
			dialogInsertSheet.addEventListener(`click`, (event) => {
				if (event.target == dialogInsertSheet) {
					dialogInsertSheet.close();
				}
			});
		}
	});

	//#region Insert sheet
	const dialogInsertSheet = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#insert-sheet`)));
	const inputUploadSheet = (/** @type {HTMLInputElement} */ (document.querySelector(`input#upload-sheet`)));
	inputUploadSheet.addEventListener(`change`, async (event) => {
		try {
			const files = inputUploadSheet.files;
			if (files) {
				for await (const text of Array.from(files).map((file) => file.text())) {
					database.push({ date: new Date(), sheet: Sheet.import(JSON.parse(text)) });
				}
				archiveSheets.data = database.map(({ date, sheet }) => ({ date: date.valueOf(), sheet: Sheet.export(sheet) }));
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (exception) {
			Application.prevent(exception);
		}
	});
	const buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, async (event) => {
		try {
			const input = await Application.prompt(`Enter the download link. You will also need a stable connection before the download is complete.`);
			if (input !== null) {
				const response = await fetch(input);
				const text = await response.text();
				database.push({ date: new Date(), sheet: Sheet.import(JSON.parse(text)) });
				archiveSheets.data = database.map(({ date, sheet }) => ({ date: date.valueOf(), sheet: Sheet.export(sheet) }));
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (exception) {
			Application.prevent(exception);
		}
	});
	//#endregion
	//#region More actions
	const dialogMoreActions = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#more-actions`)));
	const buttonDownloadSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#download-sheets`)));
	buttonDownloadSheets.addEventListener(`click`, (event) => {
		const sheets = selection().map((index) => database[index].sheet);
		sheets.forEach((sheet) => {
			Application.download(new File([JSON.stringify(Sheet.export(sheet), undefined, `\t`)], `${sheet.title}.json`, {
				type: `text/json`,
			}));
		});
		dialogMoreActions.close();
	});
	const buttonDeleteSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#delete-sheets`)));
	buttonDeleteSheets.addEventListener(`click`, async (event) => {
		const indexes = selection();
		const sheets = selection().map((index) => database[index].sheet);
		if (await Application.confirm(`Sheet(s) '${sheets.map((sheet) => sheet.title).join(`', '`)}' cant be restored. Are you sure to delete it (them)?`)) {
			database = database.filter((data, index) => !indexes.includes(index));
			archiveSheets.data = database.map(({ date, sheet }) => ({ date: date.valueOf(), sheet: Sheet.export(sheet) }));
			configureSheets();
			inputAllSheetsMark.checked = (marks.length > 0 && marks.length == selection().length);
		}
		dialogMoreActions.close();
	});
	//#endregion
	//#endregion
} catch (exception) {
	Application.prevent(exception);
}