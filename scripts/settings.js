"use strict";
let settings = Settings.import(archiveSettings.data);
window.addEventListener(`beforeunload`, (event) => {
	archiveSettings.data = Settings.export(settings);
});

try {
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
	//#region Ignore case
	const inputToggleSkipWords = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-skip-words`)));
	inputToggleSkipWords.checked = settings.skipWords;
	inputToggleSkipWords.addEventListener(`change`, (event) => {
		settings.skipWords = inputToggleSkipWords.checked;
	});
	//#endregion
	//#region Reset settings
	const buttonResetSettings = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#reset-settings`)));
	buttonResetSettings.addEventListener(`click`, async (event) => {
		if (await Application.confirm(`The settings will be reset to factory defaults. Are you sure?`, MessageType.log)) {
			settings = new Settings();
			inputToggleIncorrecCases.checked = settings.incorrectCases;
			inputToggleIgnoreCase.checked = settings.ignoreCase;
			inputToggleSkipWords.checked = settings.skipWords;
		}
	});
	//#endregion
} catch (exception) {
	Application.stabilize(exception);
}
