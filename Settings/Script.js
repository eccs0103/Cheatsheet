"use strict";

import { NotationContainer } from "../Scripts/Modules/Storage.js";
import { Settings, Themes, pathSettings } from "../Scripts/Structure.js";

try {
	//#region Definition
	const selectDropdownDesign = document.getElement(HTMLSelectElement, `select#dropdown-design`);
	const selectDropdownTheme = document.getElement(HTMLSelectElement, `select#dropdown-theme`);
	const inputToggleIncorrectCases = document.getElement(HTMLInputElement, `input#toggle-incorrect-cases`);
	const inputToggleIngnoreCase = document.getElement(HTMLInputElement, `input#toggle-ignore-case`);
	const inputToggleSkipWords = document.getElement(HTMLInputElement, `input#toggle-skip-words`);
	const buttonResetSettings = document.getElement(HTMLButtonElement, `button#reset-settings`);
	//#endregion
	//#region Controller
	const containerSettings = new NotationContainer(Settings, pathSettings);
	let settings = containerSettings.content;
	document.documentElement.dataset[`theme`] = settings.theme;
	//#endregion
	//#region Main
	//#region View
	for (const theme of Object.values(Themes)) {
		const option = selectDropdownTheme.appendChild(document.createElement(`option`));
		option.value = theme;
		option.textContent = `${theme[0].toUpperCase()}${theme.substring(1)}`;
	}
	selectDropdownTheme.value = settings.theme;
	selectDropdownTheme.addEventListener(`change`, (event) => {
		settings.theme = selectDropdownTheme.value;
		document.documentElement.dataset[`theme`] = settings.theme;
	});
	//#endregion
	//#region Search
	inputToggleIncorrectCases.checked = settings.incorrectCases;
	inputToggleIncorrectCases.addEventListener(`change`, (event) => {
		settings.incorrectCases = inputToggleIncorrectCases.checked;
	});

	inputToggleIngnoreCase.checked = settings.ignoreCase;
	inputToggleIngnoreCase.addEventListener(`change`, (event) => {
		settings.ignoreCase = inputToggleIngnoreCase.checked;
	});

	inputToggleSkipWords.checked = settings.skipWords;
	inputToggleSkipWords.addEventListener(`change`, (event) => {
		settings.skipWords = inputToggleSkipWords.checked;
	});
	//#endregion
	//#region Advanced
	buttonResetSettings.addEventListener(`click`, async (event) => {
		if (await window.confirmAsync(`The settings will be reset to factory defaults. Are you sure?`)) {
			containerSettings.reset();
			settings = containerSettings.content;
			selectDropdownTheme.value = settings.theme;
			document.documentElement.dataset[`theme`] = settings.theme;
			inputToggleIncorrectCases.checked = settings.incorrectCases;
			inputToggleIngnoreCase.checked = settings.ignoreCase;
			inputToggleSkipWords.checked = settings.skipWords;
		}
	});
	//#endregion
	//#endregion
} catch (error) {
	await window.stabilize(Error.generate(error));
}