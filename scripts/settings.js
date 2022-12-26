`use strict`;
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
		if (error instanceof Error) {
			window.alert(`'${error.name}' detected - ${error.message}\n${error.stack ?? ``}`);
		} else {
			window.alert(`Invalid exception type.`);
		}
		location.reload();
	}
	console.error(error);
}