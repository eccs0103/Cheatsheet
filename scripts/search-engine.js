"use strict";
try {
	const settings = Settings.import(archiveSettings.data);

	const h3TitleSheet = (/** @type {HTMLHeadingElement} */ (document.querySelector(`h3#title-sheet`)));
	h3TitleSheet.innerText = ``;

	const inputSeachField = (/** @type {HTMLInputElement} */ (document.querySelector(`input#search-field`)));
	if (archivePreview.data) {
		const sheet = Sheet.import(archivePreview.data);
		h3TitleSheet.innerText = sheet.title;

		/**
		 * 
		 * @param {String} pattern 
		 */
		function search(pattern) {
			const regex = new RegExp(pattern.replace(/[\$\^\*\(\)\{\}\+\?\[\]\.\?\,\|\\\/\`\_]/, (substring) => `\\${substring}`), `gmi`);
			const olPolesContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`ol#poles-container`)));
			olPolesContainer.innerHTML = ``;
			for (const pole of sheet.poles.filter((pole) => regex.test(pole.question))) {
				const sectionPole = olPolesContainer.appendChild(document.createElement(`section`));
				sectionPole.classList.add(`pole`);
				const liPoleIndex = sectionPole.appendChild(document.createElement(`li`));
				liPoleIndex.classList.add(`pole-index`);
				const spanQuestion = sectionPole.appendChild(document.createElement(`span`));
				spanQuestion.innerHTML = pattern == `` ? `${pole.question}` : `${pole.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
				const ulCasesContainer = sectionPole.appendChild(document.createElement(`ul`));
				for (let index = 0; index < pole.cases.length; index++) {
					if (!settings.hideIncorrectAnswers || index == pole.answer) {
						const _case = pole.cases[index];
						const sectionCase = ulCasesContainer.appendChild(document.createElement(`section`));
						sectionCase.classList.add(`case`);
						const liCaseIndex = sectionCase.appendChild(document.createElement(`li`));
						const spanCase = sectionCase.appendChild(document.createElement(`span`));
						spanCase.classList.add(index == pole.answer ? `highlight` : `alert`);
						spanCase.innerText = `${_case}`;
					}
				}
			}
		}

		search(inputSeachField.value);
		inputSeachField.addEventListener(`input`, (event) => {
			search(inputSeachField.value);
		});
	}

	window.addEventListener(`keydown`, (event) => {
		if (event.ctrlKey && event.code == `KeyF`) {
			event.preventDefault();
			inputSeachField.focus({ preventScroll: true });
		}
	});
} catch (error) {
	if (safeMode) {
		window.alert(error instanceof Error ? `'${error.name}' detected\n${error.message}\n${error.stack ?? ``}` : `Invalid exception type.`);
		location.reload();
	} else console.error(error);
}