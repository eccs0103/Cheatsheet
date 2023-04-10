"use strict";
try {
	//#region Initialize
	document.documentElement.dataset[`theme`] = settings.theme;

	const h3TitleSheet = (/** @type {HTMLHeadingElement} */ (document.querySelector(`h3#title-sheet`)));
	h3TitleSheet.innerText = ``;

	const inputSeachField = (/** @type {HTMLInputElement} */ (document.querySelector(`input#search-field`)));
	if (archiveMemory.data) {
		//#region If sheet exists
		const sheet = Sheet.import(archiveMemory.data);
		h3TitleSheet.innerText = sheet.title;
		//#region Structure preload
		const divPolesContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`div#poles-container`)));
		const [divPoles, spanQuestions] = sheet.poles.reduce((list, pole) => {
			const divPole = divPolesContainer.appendChild(document.createElement(`div`));
			divPole.classList.add(`pole`);
			{
				const spanQuestion = divPole.appendChild(document.createElement(`span`));
				spanQuestion.classList.add(`question`);
				spanQuestion.innerText = `${pole.question}`;
				{ }
				const divCasesContainer = divPole.appendChild(document.createElement(`div`));
				divCasesContainer.classList.add(`cases`);
				pole.cases.forEach((_case, index) => {
					if (settings.incorrectCases || index == pole.answer) {
						const divCase = divCasesContainer.appendChild(document.createElement(`div`));
						divCase.classList.add(`case`);
						{
							const spanCase = divCase.appendChild(document.createElement(`span`));
							spanCase.classList.add(index == pole.answer ? `highlight` : `alert`);
							spanCase.innerText = `${_case}`;
						}
					}
				});
				{ }
				return [[...list[0], divPole], [...list[1], spanQuestion]];
			}
		}, (/** @type {[Array<HTMLElement>, Array<HTMLElement>]} */ ([[], []])));
		//#endregion
		//#region Search
		const flags = (() => {
			const result = new Set(`g`);
			if (settings.ignoreCase) {
				result.add(`i`);
			}
			return Array.from(result).join(``);
		})();
		/**
		 * 
		 * @param {String} pattern 
		 */
		function search(pattern) {
			pattern = pattern.replace(/[-\\^$*+?.()|[\]{}]/g, `\\$&`);
			if (settings.skipWords) {
				pattern = pattern.replace(/ /g, `$&(\\S+ )*?`);
			}
			const regex = new RegExp(pattern, flags);
			sheet.poles.forEach((pole, index) => {
				const match = (pattern == `` || regex.test(pole.question));
				divPoles[index].hidden = !match;
				if (match) {
					spanQuestions[index].innerHTML = pattern == `` ? `${pole.question}` : `${pole.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
				}
			});
		}
		//#endregion
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
} catch (exception) {
	Application.prevent(exception);
}