"use strict";
let settings = Settings.import(archiveSettings.data);
window.addEventListener(`beforeunload`, (event) => {
	archiveSettings.data = Settings.export(settings);
});

try {
	//#region Hide Incorrect Answers
	const inputToggleHideIncorrectAnswers = (/** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-hide-incorrect-answers`)));
	inputToggleHideIncorrectAnswers.checked = archiveSettings.data.hideIncorrectAnswers;
	inputToggleHideIncorrectAnswers.addEventListener(`change`, (event) => {
		settings.hideIncorrectAnswers = inputToggleHideIncorrectAnswers.checked;
	});
	//#endregion
} catch (error) {
	if (safeMode) {
		Program.alert(error instanceof Error ? error.stack ?? `${error.name}: ${error.message}` : `Invalid exception type.`, MessageType.error)
			.then(() => location.reload());
	} else console.error(error);
}