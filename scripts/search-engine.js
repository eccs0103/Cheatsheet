// const sheet = Sheet.import(/** @type {SheetNotation} */(JSON.parse(text)));
// const settings = Settings.import(archiveSettings.data);
// window.addEventListener(`beforeunload`, (event) => {
// 	archiveSettings.data = Settings.export(settings);
// });

// /**
//  * 
//  * @param {String} pattern 
//  */
// function search(pattern) {
// 	const regex = new RegExp(pattern.replace(/[\$\^\*\(\)\{\}\+\?\[\]\.\?\,\|\\\/\`\_]/, (substring) => `\\${substring}`), `gmi`);
// 	const olPolesContainer = (/** @type {HTMLOListElement} */ (document.querySelector(`ol#poles-container`)));
// 	olPolesContainer.innerHTML = ``;
// 	for (const pole of sheet.poles.filter((pole) => regex.test(pole.question))) {
// 		const liPole = olPolesContainer.appendChild(document.createElement(`li`));
// 		const bQuestion = liPole.appendChild(document.createElement(`b`));
// 		bQuestion.innerHTML = pattern == `` ? `${pole.question}` : `${pole.question.replace(regex, (substring) => `<mark>${substring}</mark>`)}`;
// 		const ulCasesContainer = liPole.appendChild(document.createElement(`ul`));
// 		for (let index = 0; index < pole.cases.length; index++) {
// 			if (!settings.hideIncorrectAnswers || index == pole.answer) {
// 				const _case = pole.cases[index];
// 				const liCase = ulCasesContainer.appendChild(document.createElement(`li`));
// 				const spanCase = liCase.appendChild(document.createElement(`span`));
// 				spanCase.classList.add(index == pole.answer ? `highlight` : `alert`);
// 				spanCase.innerText = `${_case}`;
// 			}
// 		}
// 	}
// }

// const inputSeachField = (/** @type {HTMLInputElement} */ (document.querySelector(`input#search-field`)));
// search(inputSeachField.value);
// inputSeachField.addEventListener(`input`, (event) => {
// 	search(inputSeachField.value);
// });

try {
	
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