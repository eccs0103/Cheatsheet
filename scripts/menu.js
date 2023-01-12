"use strict";
try {
	archiveSheets.change((data) => data.map((item) => {
		try {
			const sheet = Sheet.import(item);
			window.alert(`Found sheet '${sheet.title}' with old data format. The old formats are no longer supported, so tey will be converted to the new one.`);
			return { date: Date.now(), sheet: Sheet.export(sheet) };
		} catch (error) {
			return item;
		}
	}));

	const templateSheetTemplate = (/** @type {HTMLTemplateElement} */ (document.querySelector(`template#sheet-template`)));
	const container = (() => {
		if (templateSheetTemplate.parentElement) {
			return templateSheetTemplate.parentElement;
		} else {
			throw new ReferenceError(`Parent element cant be found.`);
		}
	})();

	const selection = (/** @type {Set<{ index: Number, sheet: Sheet }>} */ (new Set()));
	const buttonOpenMoreDialog = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#open-more-dialog`)));

	function configureSheets() {
		Array.from(container.querySelectorAll(`*:not(template#sheet-template)`)).forEach((element) => element.remove());
		archiveSheets.data.map(({ date, sheet }) => ({ date: new Date(date), sheet: Sheet.import(sheet) })).forEach(({ date, sheet }, index) => {
			const divSheetCell = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`div#sheet-cell`))));
			{
				const inputSheetMark = (/** @type {HTMLInputElement} */ (divSheetCell.querySelector(`input#sheet-mark`)));
				inputSheetMark.id = `sheet-mark-${index}`;
				const data = { index: index, sheet: sheet };
				inputSheetMark.addEventListener(`change`, (event) => {
					if (inputSheetMark.checked) {
						selection.add(data);
					} else {
						selection.delete(data);
					}
					buttonOpenMoreDialog.hidden = !(selection.size > 0);
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
				// const buttonRemoveSheet = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#remove-sheet`)));
				// buttonRemoveSheet.addEventListener(`click`, (event) => {
				// 	if (window.confirm(`Sheet '${sheet.title}' cant be restored. Are you sure to delete it?`)) {
				// 		archiveSheets.change((sheets) => sheets.filter((sheet, index2) => index2 != index));
				// 		configureSheets();
				// 	}
				// });
			}
		});
	}

	configureSheets();

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
				const results = [];
				for (const file of files) {
					const text = await file.text()
						.then((value) => value)
						.catch((reason) => {
							throw (reason instanceof Error ? reason : new Error(reason));
						});
					results.push({ date: Date.now(), sheet: Sheet.export(Sheet.import(JSON.parse(text))) });
				}
				archiveSheets.change((sheets) => [...sheets, ...results]);
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

	const dialogMoreActions = (/** @type {HTMLDialogElement} */ (document.querySelector(`dialog#more-actions`)));
	buttonOpenMoreDialog.addEventListener(`click`, (event) => {
		dialogMoreActions.showModal();
		dialogMoreActions.addEventListener(`click`, (event2) => {
			if (event2.target == dialogMoreActions) {
				dialogMoreActions.close();
			}
		});
	});

	const buttonDownloadSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#download-sheets`)));
	buttonDownloadSheets.addEventListener(`click`, (event) => {
		selection.forEach((data) => {
			Manager.download(new File([JSON.stringify(Sheet.export(data.sheet), undefined, `\t`)], `${data.sheet.title}.json`, {
				type: `text/json`,
			}));
		});
		(/** @type {Array<HTMLInputElement>} */ (Array.from(container.querySelectorAll(`input[type="checkbox"][id^="sheet-mark"]`)))).forEach((element) => {
			element.checked = false;
		});
		buttonOpenMoreDialog.hidden = true;
		selection.clear();
		dialogMoreActions.close();
	});

	const buttonDeleteSheets = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#delete-sheets`)));
	buttonDeleteSheets.addEventListener(`click`, (event) => {
		if (window.confirm(`Sheets '${Array.from(selection).map((data) => data.sheet.title).join(`', '`)}' cant be restored. Are you sure to delete them?`)) {
			const indexes = Array.from(selection).map((data) => data.index);
			archiveSheets.change((data) => data.filter((sheet, index) => !indexes.includes(index)));
			configureSheets();
			buttonOpenMoreDialog.hidden = true;
			selection.clear();
		}
		dialogMoreActions.close();
	});
} catch (error) {
	if (safeMode) {
		window.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`);
		location.reload();
	} else console.error(error);
}