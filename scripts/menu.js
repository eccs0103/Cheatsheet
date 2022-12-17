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
		[...container.querySelectorAll(`*:not(template#sheet-template)`)].forEach((element) => element.remove());
		for (const sheet of archiveSheets.data.map((notation) => Sheet.import(notation))) {
			const buttonSheetInformation = container.appendChild((/** @type {HTMLButtonElement} */ ((/** @type {DocumentFragment} */ (templateSheetTemplate.content.cloneNode(true))).querySelector(`button#sheet-information`))));
			buttonSheetInformation.addEventListener(`click`, (event) => {
				archivePreview.data = Sheet.export(sheet);
				location.href = `./search-engine.html`;
			});
			{
				const spanSheetTitle = (/** @type {HTMLSpanElement} */ (buttonSheetInformation.querySelector(`span#sheet-title`)));
				spanSheetTitle.innerText = sheet.title;
				const dfnSheetDate = (/** @type {HTMLElement} */ (buttonSheetInformation.querySelector(`dfn#sheet-date`)));
				dfnSheetDate.innerText = sheet.date.toLocaleString();
			}
		}
	}

	configureSheets();

	const buttonImportSheet = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#import-sheet`)));
	buttonImportSheet.addEventListener(`click`, (event) => {
		const url = window.prompt(`Enter the url.`);
		if (url != null) {
			Manager.queryText(url).then((text) => {
				archiveSheets.change((sheets) => {
					sheets.push(Sheet.parse(JSON.parse(text)));
					return sheets;
				});
				configureSheets();
			}).catch((reason) => {
				window.alert(`Operation failed with message: "${reason}".`);
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