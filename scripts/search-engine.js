"use strict";
try {
	//#region Initialize
	const settings = Settings.import(archiveSettings.data);

	const h3TitleSheet = (/** @type {HTMLHeadingElement} */ (document.querySelector(`h3#title-sheet`)));
	h3TitleSheet.innerText = ``;

	const inputSeachField = (/** @type {HTMLInputElement} */ (document.querySelector(`input#search-field`)));
	if (archivePreview.data) {
		//#region If sheet exists
		const sheet = Sheet.import(archivePreview.data);
		h3TitleSheet.innerText = sheet.title;

		//#region Structure preload
		const olPolesContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`ol#poles-container`)));
		const structure = sheet.poles.map((pole) => {
			const sectionPole = olPolesContainer.appendChild(document.createElement(`section`));
			sectionPole.classList.add(`pole`);
			const liPoleIndex = sectionPole.appendChild(document.createElement(`li`));
			liPoleIndex.classList.add(`pole-index`);
			const spanQuestion = sectionPole.appendChild(document.createElement(`span`));
			spanQuestion.innerText = `${pole.question}`;
			const ulCasesContainer = sectionPole.appendChild(document.createElement(`ul`));
			pole.cases.forEach((_case, index) => {
				if (!settings.hideIncorrectAnswers || index == pole.answer) {
					const sectionCase = ulCasesContainer.appendChild(document.createElement(`section`));
					sectionCase.classList.add(`case`);
					const liCaseIndex = sectionCase.appendChild(document.createElement(`li`));
					const spanCase = sectionCase.appendChild(document.createElement(`span`));
					spanCase.classList.add(index == pole.answer ? `highlight` : `alert`);
					spanCase.innerText = `${_case}`;
				}
			});
			return { pole: sectionPole, question: spanQuestion };
		});
		//#endregion

		/**
		 * 
		 * @param {String} pattern 
		 */
		function search(pattern) {
			const regex = new RegExp(pattern.replace(/[\$\^\*\(\)\{\}\+\?\[\]\.\?\,\|\\\/\`\_]/, (substring) => `\\${substring}`), `gmi`);
			sheet.poles.forEach((pole, index) => {
				const match = (pattern == `` || regex.test(pole.question));
				structure[index].pole.hidden = !match;
				if (match) {
					structure[index].question.innerHTML = pattern == `` ? `${pole.question}` : `${pole.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
				}
			});
		}

		search(inputSeachField.value);
		inputSeachField.addEventListener(`input`, (event) => {
			search(inputSeachField.value);
		});
		//#endregion
	}

	window.addEventListener(`keydown`, (event) => {
		if (event.ctrlKey && event.code == `KeyF`) {
			event.preventDefault();
			inputSeachField.focus({ preventScroll: true });
		}
	});
	//#endregion
} catch (error) {
	if (safeMode) {
		Program.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`, MessageType.error)
			.then(() => location.reload());
	} else console.error(error);
}