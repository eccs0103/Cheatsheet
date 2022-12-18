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
		for (var sheet of archiveSheets.data.map((notation) => Sheet.import(notation))) {
			var buttonSheetInformation = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`button#sheet-information`))));
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
		}
	}

	configureSheets();

	var buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, (event) => {
		var url = window.prompt(`Enter the url.`);
		if (url != null) {
			if (url == `/storage -clear`) {
				archiveSheets.data = [];
				configureSheets();
			} else {
				Manager.queryText(url).then((text) => {
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