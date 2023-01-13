"use strict";
try {
	//#region Converting to a new version
	archiveSheets.change((data) => data.map((item) => {
		try {
			const sheet = Sheet.import(item);
			Program.alert(`Found sheet '${sheet.title}' with old data format. The old formats are no longer supported, so tey will be converted to the new one.`, MessageType.warn);
			return { date: Date.now(), sheet: Sheet.export(sheet) };
		} catch (error) {
			return item;
		}
	}));
	//#endregion
	//#region Initialize
	const templateSheetTemplate = (/** @type {HTMLTemplateElement} */ (document.querySelector(`template#sheet-template`)));
	const container = (() => {
		if (templateSheetTemplate.parentElement) {
			return templateSheetTemplate.parentElement;
		} else {
			throw new ReferenceError(`Parent element cant be found.`);
		}
	})();

	let marks = (/** @type {Array<HTMLInputElement>} */ ([]));
	function selection() {
		const results = (/** @type {Array<Number>} */ ([]));
		marks.forEach((mark, index) => {
			if (mark.checked) {
				results.push(index);
			}
		});
		return results;
	}
	const buttonOpenMoreDialog = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#open-more-dialog`)));

	let database = archiveSheets.data.map(({ date, sheet }) => ({ date: new Date(date), sheet: Sheet.import(sheet) }));
	//#region Configuration
	function configureSheets() {
		Array.from(container.querySelectorAll(`*:not(template#sheet-template)`)).forEach((element) => element.remove());
		marks = database.map(({ date, sheet }, index) => {
			const divSheetCell = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`div#sheet-cell`))));
			{
				const inputSheetMark = (/** @type {HTMLInputElement} */ (divSheetCell.querySelector(`input#sheet-mark`)));
				inputSheetMark.id = `sheet-mark-${index}`;
				inputSheetMark.addEventListener(`change`, (event) => {
					const indexes = selection();
					inputAllSheetsMark.checked = (indexes.length == marks.length);
					buttonOpenMoreDialog.hidden = !(indexes.length > 0);
				});
				const labelSheetMark = (/** @type {HTMLLabelElement} */ (divSheetCell.querySelector(`label[for="sheet-mark"]`)));
				labelSheetMark.htmlFor = inputSheetMark.id;
				const buttonSheetInformation = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#sheet-information`)));
				buttonSheetInformation.addEventListener(`click`, (event) => {
					archivePreview.data = Sheet.export(sheet);
					location.href = `./search-engine.html`;
				});
				const spanSheetTitle = (/** @type {HTMLSpanElement} */ (divSheetCell.querySelector(`span#sheet-title`)));
				spanSheetTitle.innerText = sheet.title;
				const dfnSheetDate = (/** @type {HTMLElement} */ (divSheetCell.querySelector(`dfn#sheet-date`)));
				dfnSheetDate.innerText = date.toLocaleString();
				return inputSheetMark;
			}
		});
	}
	//#endregion

	configureSheets();

	//#region Insert sheet
	const buttonOpenInsertDialog = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#open-insert-dialog`)));
	const dialogInsertSheet = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#insert-sheet`)));
	buttonOpenInsertDialog.addEventListener(`click`, (event) => {
		dialogInsertSheet.showModal();
		dialogInsertSheet.addEventListener(`click`, (event2) => {
			if (event2.target == dialogInsertSheet) {
				dialogInsertSheet.close();
			}
		});
	});

	const inputUploadSheet = (/** @type {HTMLInputElement} */ (document.querySelector(`input#upload-sheet`)));
	inputUploadSheet.addEventListener(`change`, async (event) => {
		try {
			const files = inputUploadSheet.files;
			if (files) {
				const results = (/** @type {Array<Sheet>} */ ([]));
				for (const file of files) {
					const text = await file.text()
						.then((value) => value)
						.catch((reason) => {
							throw (reason instanceof Error ? reason : new Error(reason));
						});
					results.push(Sheet.import(JSON.parse(text)));
				}
				database.push(...results.map((sheet) => ({ date: new Date(), sheet: sheet })));
				archiveSheets.data = database.map(({ date, sheet }) => ({ date: date.valueOf(), sheet: Sheet.export(sheet) }));
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (error) {
			if (safeMode) {
				Program.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`, MessageType.error)
					.then(() => location.reload());
			} else console.error(error);
		}
	});

	const buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, async (event) => {
		try {
			const input = await Program.prompt(`Enter the url.`);
			if (input != null) {
				const response = await fetch(input)
					.then((value) => value)
					.catch((reason) => {
						throw (reason instanceof Error ? reason : new Error(reason));
					});
				const text = await response.text()
					.then((value) => value)
					.catch((reason) => {
						throw (reason instanceof Error ? reason : new Error(reason));
					});
				database.push({ date: new Date(), sheet: Sheet.import(JSON.parse(text)) });
				archiveSheets.data = database.map(({ date, sheet }) => ({ date: date.valueOf(), sheet: Sheet.export(sheet) }));
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (error) {
			if (safeMode) {
				Program.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`, MessageType.error)
					.then(() => location.reload());
			} else console.error(error);
		}
	});
	//#endregion
	//#region More actions
	const dialogMoreActions = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#more-actions`)));
	buttonOpenMoreDialog.addEventListener(`click`, (event) => {
		dialogMoreActions.showModal();
		dialogMoreActions.addEventListener(`click`, (event2) => {
			if (event2.target == dialogMoreActions) {
				dialogMoreActions.close();
			}
		});
	});

	const inputAllSheetsMark = (/** @type {HTMLInputElement} */ (document.querySelector(`input#all-sheets-mark`)));
	inputAllSheetsMark.addEventListener(`change`, (event) => {
		marks.forEach((mark) => mark.checked = inputAllSheetsMark.checked);
		buttonOpenMoreDialog.hidden = !inputAllSheetsMark.checked;
	});

	const buttonDownloadSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#download-sheets`)));
	buttonDownloadSheets.addEventListener(`click`, (event) => {
		const sheets = selection().map((index) => database[index].sheet);
		sheets.forEach((sheet) => {
			Manager.download(new File([JSON.stringify(Sheet.export(sheet), undefined, `\t`)], `${sheet.title}.json`, {
				type: `text/json`,
			}));
		});
		inputAllSheetsMark.checked = false;
		marks.forEach((element) => element.checked = false);
		buttonOpenMoreDialog.hidden = true;
		dialogMoreActions.close();
	});

	const buttonDeleteSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#delete-sheets`)));
	buttonDeleteSheets.addEventListener(`click`, async (event) => {
		const indexes = selection();
		const sheets = selection().map((index) => database[index].sheet);
		if (await Program.confirm(`Sheet(s) '${sheets.map((sheet) => sheet.title).join(`', '`)}' cant be restored. Are you sure to delete it (them)?`)) {
			database = database.filter((data, index) => !indexes.includes(index));
			configureSheets();
			buttonOpenMoreDialog.hidden = true;
		}
		dialogMoreActions.close();
	});
	//#endregion
	//#endregion
} catch (error) {
	if (safeMode) {
		Program.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`, MessageType.error)
			.then(() => location.reload());
	} else console.error(error);
}