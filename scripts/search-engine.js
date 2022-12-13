const url = (() => {
	let input = window.prompt(`Enter the url.`);
	while (!input) {
		input = window.prompt(`Enter the url.`);
	}
	return input;
})();
Manager.queryText(url).then((text) => {
	const sheet = Sheet.import(/** @type {SheetNotation} */(JSON.parse(text)));

	const settings = Settings.import(archiveSettings.data);
	window.addEventListener(`beforeunload`, (event) => {
		archiveSettings.data = Settings.export(settings);
	});

	/**
	 * 
	 * @param {String} pattern 
	 */
	function search(pattern) {
		const regex = new RegExp(pattern.replace(/[\$\^\*\(\)\{\}\+\?\[\]\.\?\,\|\\\/\`\_]/, (substring) => `\\${substring}`), `gmi`);
		const olPolesContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`ol#poles-container`)));
		olPolesContainer.innerHTML = ``;
		for (const pole of sheet.poles.filter((pole) => regex.test(pole.question))) {
			const liPole = olPolesContainer.appendChild(document.createElement(`li`));
			const bQuestion = liPole.appendChild(document.createElement(`b`));
			bQuestion.innerHTML = pattern == `` ? `${pole.question}` : `${pole.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
			const ulCasesContainer = liPole.appendChild(document.createElement(`ul`));
			for (let index = 0; index < pole.cases.length; index++) {
				if (!settings.hideIncorrectAnswers || index == pole.answer) {
					const _case = pole.cases[index];
					const liCase = ulCasesContainer.appendChild(document.createElement(`li`));
					const spanCase = liCase.appendChild(document.createElement(`span`));
					spanCase.classList.add(index == pole.answer ? `highlight` : `alert`);
					spanCase.innerText = `${_case}`;
				}
			}
		}
	}

	const inputSeachField = (/** @type {HTMLInputElement} */ (document.querySelector(`input#search-field`)));
	search(inputSeachField.value);
	inputSeachField.addEventListener(`input`, (event) => {
		search(inputSeachField.value);
	});

	const inputA = (/** @type {HTMLInputElement} */ (document.querySelector(`input#a`)));
	inputA.checked = settings.hideIncorrectAnswers;
	inputA.addEventListener(`change`, (event) => {
		settings.hideIncorrectAnswers = inputA.checked;
		search(inputSeachField.value);
	});
}).catch((reason) => {
	window.alert(reason);
});

// new Sheet(`A`, ...[
// 	new Pole(`A-1`, 0, ...[
// 		`A-1-1`,
// 		`A-1-2`,
// 		`A-1-3`,
// 		`A-1-4`,
// 	]),
// 	new Pole(`A-2`, 0, ...[
// 		`A-2-1`,
// 		`A-2-2`,
// 		`A-2-3`,
// 		`A-2-4`,
// 	]),
// 	new Pole(`A-3`, 0, ...[
// 		`A-3-1`,
// 		`A-3-2`,
// 		`A-3-3`,
// 		`A-3-4`,
// 	]),
// 	new Pole(`A-4`, 0, ...[
// 		`A-4-1`,
// 		`A-4-2`,
// 		`A-4-3`,
// 		`A-4-4`,
// 	]),
// ]);


