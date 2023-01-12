"use strict";
try {
	function configureSheets() {
		const templateSheetTemplate = (/** @type {HTMLTemplateElement} */ (document.querySelector(`template#sheet-template`)));
		const container = (() => {
			if (templateSheetTemplate.parentElement) {
				return templateSheetTemplate.parentElement;
			} else {
				throw new ReferenceError(`Parent element cant be found.`);
			}
		})();
		Array.from(container.querySelectorAll(`*:not(template#sheet-template)`)).forEach((element) => element.remove());
		archiveSheets.data.map((item) => {
			const date = item[`date`];
			const sheet = item[`sheet`];
			if (date == undefined || sheet == undefined) {
				const oldSheet = (/** @type {SheetNotation} */ (item));
				window.alert(`Found sheet - '${oldSheet.title}' with old data format. The old formats are no longer supported, so they will be converted to the new one.`);
				return { date: new Date(), sheet: Sheet.import(oldSheet) };
			} else {
				return { date: new Date(date), sheet: Sheet.import(sheet) };
			}
		}).forEach(({ date, sheet }, index) => {
			const divSheetCell = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`div#sheet-cell`))));
			{
				const buttonSheetInformation = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#sheet-information`)));
				buttonSheetInformation.addEventListener(`click`, (event) => {
					archivePreview.data = Sheet.export(sheet);
					location.href = `./search-engine.html`;
				});
				const spanSheetTitle = (/** @type {HTMLSpanElement} */ (divSheetCell.querySelector(`span#sheet-title`)));
				spanSheetTitle.innerText = sheet.title;
				const dfnSheetDate = (/** @type {HTMLElement} */ (divSheetCell.querySelector(`dfn#sheet-date`)));
				dfnSheetDate.innerText = date.toLocaleString();
				const buttonRemoveSheet = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#remove-sheet`)));
				buttonRemoveSheet.addEventListener(`click`, (event) => {
					if (window.confirm(`Sheet '${sheet.title}' cant be restored. Are you sure to delete it?`)) {
						archiveSheets.change((sheets) => sheets.filter((sheet, index2) => index2 != index));
						configureSheets();
					}
				});
			}
		});
	}

	configureSheets();

	const buttonOpenInsertDialog = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#open-insert-dialog`)));
	const dialogInsertSheet = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#insert-sheet`)));
	buttonOpenInsertDialog.addEventListener(`click`, async (event) => {
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
				const file = files[0];
				const text = await file.text()
					.then((value) => value)
					.catch((reason) => {
						throw (reason instanceof Error ? reason : new Error(reason));
					});
				archiveSheets.change((sheets) => {
					sheets.push({ date: Date.now(), sheet: Sheet.export(Sheet.import(JSON.parse(text))) });
					return sheets;
				});
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (error) {
			if (safeMode) {
				window.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`);
				location.reload();
			} else console.error(error);
		}
	});

	const buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, async (event) => {
		try {
			const input = window.prompt(`Enter the url.`);
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
				archiveSheets.change((sheets) => {
					sheets.push({ date: Date.now(), sheet: Sheet.export(Sheet.import(JSON.parse(text))) });
					return sheets;
				});
				configureSheets();
				dialogInsertSheet.close();
			}
		} catch (error) {
			if (safeMode) {
				window.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`);
				location.reload();
			} else console.error(error);
		}
	});
} catch (error) {
	if (safeMode) {
		window.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`);
		location.reload();
	} else console.error(error);
}