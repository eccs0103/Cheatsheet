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
		const divPollsContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`div#polls-container`)));
		const [divPolls, spanQuestions] = sheet.polls.reduce((list, poll) => {
			const divPoll = divPollsContainer.appendChild(document.createElement(`div`));
			divPoll.classList.add(`poll`);
			{
				const spanQuestion = divPoll.appendChild(document.createElement(`span`));
				spanQuestion.classList.add(`question`);
				spanQuestion.innerText = `${poll.question}`;
				{ }
				const divCasesContainer = divPoll.appendChild(document.createElement(`div`));
				divCasesContainer.classList.add(`cases`);
				poll.cases.forEach((_case, index) => {
					if (settings.incorrectCases || index == poll.answer) {
						const divCase = divCasesContainer.appendChild(document.createElement(`div`));
						divCase.classList.add(`case`);
						{
							const spanCase = divCase.appendChild(document.createElement(`span`));
							spanCase.classList.add(index == poll.answer ? `highlight` : `alert`);
							spanCase.innerText = `${_case}`;
						}
					}
				});
				{ }
				return [[...list[0], divPoll], [...list[1], spanQuestion]];
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
			sheet.polls.forEach((poll, index) => {
				const match = (pattern == `` || regex.test(poll.question));
				divPolls[index].hidden = !match;
				if (match) {
					spanQuestions[index].innerHTML = pattern == `` ? `${poll.question}` : `${poll.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
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