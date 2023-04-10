"use strict";
document.documentElement.dataset[`theme`] = settings.theme;
window.addEventListener(`beforeunload`, (event) => {
	archiveSettings.data = Settings.export(settings);
});

try {
	//#region Theme
	const selectDropdownTheme = (/** @type {HTMLSelectElement} */ (document.querySelector(`select#dropdown-theme`)));
	for (const theme in ThemeType) {
		const option = selectDropdownTheme.appendChild(document.createElement(`option`));
		option.value = `${theme}`;
		option.innerText = `${theme.replace(/\b\w/, (letter) => letter.toUpperCase())}`;
	}
	selectDropdownTheme.value = `${settings.theme}`;
	selectDropdownTheme.addEventListener(`change`, (event) => {
		settings.theme = selectDropdownTheme.value;
		document.documentElement.dataset[`theme`] = settings.theme;
	});
	//#endregion
	//#region Incorrect cases
	const inputToggleIncorrecCases = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-incorrect-cases`)));
	inputToggleIncorrecCases.checked = settings.incorrectCases;
	inputToggleIncorrecCases.addEventListener(`change`, (event) => {
		settings.incorrectCases = inputToggleIncorrecCases.checked;
	});
	//#endregion
	//#region Ignore case
	const inputToggleIgnoreCase = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-ignore-case`)));
	inputToggleIgnoreCase.checked = settings.ignoreCase;
	inputToggleIgnoreCase.addEventListener(`change`, (event) => {
		settings.ignoreCase = inputToggleIgnoreCase.checked;
	});
	//#endregion
	//#region Skip words
	const inputToggleSkipWords = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-skip-words`)));
	inputToggleSkipWords.checked = settings.skipWords;
	inputToggleSkipWords.addEventListener(`change`, (event) => {
		settings.skipWords = inputToggleSkipWords.checked;
	});
	//#endregion
	//#region Experimental functions
	const inputToggleExperiments = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-experiments`)));
	inputToggleExperiments.checked = settings.experiments;
	inputToggleExperiments.addEventListener(`change`, async (event) => {
		if (await Application.confirm(`Switching ${inputToggleExperiments.checked ? `to` : `from`} experimental mode. Are you sure?`, MessageType.warn)) {
			settings.experiments = inputToggleExperiments.checked;
		}
		inputToggleExperiments.checked = settings.experiments;
	});
	//#endregion
	//#region Reset settings
	const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
	buttonResetSettings.addEventListener(`click`, async (event) => {
		if (await Application.confirm(`The settings will be reset to factory defaults. Are you sure?`, MessageType.log)) {
			const previous = settings;
			settings = new Settings();
			settings.experiments = previous.experiments;
			inputToggleIncorrecCases.checked = settings.incorrectCases;
			inputToggleIgnoreCase.checked = settings.ignoreCase;
			inputToggleSkipWords.checked = settings.skipWords;
			inputToggleExperiments.checked = settings.experiments;
		}
	});
	//#endregion
} catch (exception) {
	Application.prevent(exception);
}
