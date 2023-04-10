"use strict";
try {
	document.documentElement.dataset[`theme`] = settings.theme;

	const buttonSave = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#save`)));
	buttonSave.addEventListener(`click`, (event) => {

	});
} catch (exception) {
	Application.prevent(exception);
}