try {
	function configureSheets() {
		var templateSheetTemplate = (/** @type {HTMLTemplateElement} */ (document.querySelector(`template#sheet-template`)));
		var container = (() => {
			if (templateSheetTemplate.parentElement) {
				return templateSheetTemplate.parentElement;
			} else {
				throw new ReferenceError(`Parent element cant be found.`);
			}
		})();
		[...container.querySelectorAll(`*:not(template#sheet-template)`)].forEach((element) => element.remove());
		archiveSheets.data.map((notation) => Sheet.import(notation)).forEach((sheet, index) => {
			var divSheetCell = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`div#sheet-cell`))));
			{
				var buttonSheetInformation = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#sheet-information`)));
				buttonSheetInformation.addEventListener(`click`, (event) => {
					archivePreview.data = Sheet.export(sheet);
					location.href = `./search-engine.html`;
				});
				{
					var spanSheetTitle = (/** @type {HTMLSpanElement} */ (buttonSheetInformation.querySelector(`span#sheet-title`)));
					spanSheetTitle.innerText = sheet.title;
					var dfnSheetDate = (/** @type {HTMLElement} */ (buttonSheetInformation.querySelector(`dfn#sheet-date`)));
					dfnSheetDate.innerText = sheet.date.toLocaleString();
				}
				var buttonRemoveSheet = (/** @type {HTMLButtonElement} */ (divSheetCell.querySelector(`button#remove-sheet`)));
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

	var buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, (event) => {
		var input = window.prompt(`Enter the url.`);
		if (input != null) {
			Manager.queryText(input).then((text) => {
				archiveSheets.change((sheets) => {
					sheets.push(Sheet.parse(JSON.parse(text)));
					return sheets;
				});
				configureSheets();
				return null;
			}).catch((error) => {
				if (safeMode) {
					if (error instanceof Error) {
						window.alert(`'${error.name}' detected - ${error.message}\n${error.stack ?? ``}`);
					} else {
						window.alert(`Invalid exception type.`);
					}
				}
				console.error(error);
			});
		}
	});
} catch (error) {
	if (safeMode) {
		if (error instanceof Error) {
			window.alert(`'${error.name}' detected - ${error.message}\n${error.stack ?? ``}`);
		} else {
			window.alert(`Invalid exception type.`);
		}
		location.reload();
	}
	console.error(error);
}