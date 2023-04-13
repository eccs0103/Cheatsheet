"use strict";
try {
	document.documentElement.dataset[`theme`] = settings.theme;

	const sheetConstruct = archiveConstruct.data ?? (/** @type {SheetNotation} */ ({
		title: ``,
		polls: [],
	}));

	const inputSheetTitle = (/** @type {HTMLInputElement} */ (document.querySelector(`input#sheet-title`)));
	inputSheetTitle.value = sheetConstruct.title;
	inputSheetTitle.addEventListener(`change`, (event) => {
		sheetConstruct.title = inputSheetTitle.value;
	});

	const divPollsConstructor = (/** @type {HTMLDivElement} */ (document.querySelector(`div#polls-constructor`)));

	const formInsertPollGroup = divPollsConstructor.appendChild(document.createElement(`form`));
	formInsertPollGroup.classList.add(`contents`);
	formInsertPollGroup.method = `dialog`;
	{
		const inputInsertPoll = formInsertPollGroup.appendChild(document.createElement(`input`));
		inputInsertPoll.type = `text`;
		inputInsertPoll.required = true;
		inputInsertPoll.placeholder = `Input the question`;
		inputInsertPoll.classList.add(`flex`, `depth`);
		// const poleInitialValue = ``;
		// inputInsertPoll.value = poleInitialValue;
		{ }
		const buttonAddPoll = formInsertPollGroup.appendChild(document.createElement(`button`));
		buttonAddPoll.classList.add(`flex`);
		buttonAddPoll.type = `reset`;
		buttonAddPoll.style.gridColumn = `-2 / -1`;
		buttonAddPoll.style.alignItems = `center`;
		buttonAddPoll.addEventListener(`click`, (event) => {
			if (formInsertPollGroup.checkValidity()) {
				sheetConstruct.polls.push(/** @type {PollNotation} */({
					question: inputInsertPoll.value,
					answer: 0,
					cases: [],
				}));
				// inputInsertPoll.value = poleInitialValue;
				configurePolls();
			}
		});
		{
			const imgIcon = buttonAddPoll.appendChild(document.createElement(`img`));
			imgIcon.src = `../resources/add.png`;
			imgIcon.classList.add(`icon`);
			{ }
		}
	}

	//#region Configure Polls
	function configurePolls() {
		divPollsConstructor.querySelectorAll(`div[id^="poll-group-"]`).forEach(element => {
			element.remove();
		});
		sheetConstruct.polls.forEach((pollConstruct, pollIndex) => {
			const divPollGroup = divPollsConstructor.insertBefore(document.createElement(`div`), formInsertPollGroup);
			divPollGroup.id = `poll-group-${pollIndex}`;
			divPollGroup.classList.add(`contents`);
			{
				const divPoll = divPollGroup.appendChild(document.createElement(`div`));
				divPoll.classList.add(`poll`);
				divPoll.style.gridColumn = `1 / 2`;
				{
					const inputQuestion = divPoll.appendChild(document.createElement(`input`));
					inputQuestion.type = `text`;
					inputQuestion.required = true;
					inputQuestion.value = pollConstruct.question;
					inputQuestion.classList.add(`question`);
					inputQuestion.addEventListener(`change`, (event) => {
						pollConstruct.question = inputQuestion.value;
					});
					{ }
					const divCasesConstructor = divPoll.appendChild(document.createElement(`div`));
					divCasesConstructor.classList.add(`cases-constructor`);
					{
						const formInsertCaseGroup = divCasesConstructor.appendChild(document.createElement(`form`));
						formInsertCaseGroup.classList.add(`contents`);
						formInsertCaseGroup.method = `dialog`;
						{
							const inputInsertCase = formInsertCaseGroup.appendChild(document.createElement(`input`));
							inputInsertCase.type = `text`;
							inputInsertCase.required = true;
							inputInsertCase.placeholder = `Input the case`;
							inputInsertCase.classList.add(`flex`, `depth`);
							inputInsertCase.style.padding = `calc(var(--size-gap) / 2)`;
							// const caseInitialValue = ``;
							// inputInsertCase.value = caseInitialValue;
							{ }
							const buttonAddCase = formInsertCaseGroup.appendChild(document.createElement(`button`));
							buttonAddCase.classList.add(`flex`);
							buttonAddCase.type = `reset`;
							buttonAddCase.style.gridColumn = `-2 / -1`;
							buttonAddCase.style.alignItems = `center`;
							buttonAddCase.addEventListener(`click`, (event) => {
								if (formInsertCaseGroup.checkValidity()) {
									pollConstruct.cases.push(inputInsertCase.value);
									// inputInsertCase.value = caseInitialValue;
									configureCases();
								}
							});
							{
								const imgIcon = buttonAddCase.appendChild(document.createElement(`img`));
								imgIcon.src = `../resources/add.png`;
								imgIcon.classList.add(`icon`, `in-line`);
								{ }
							}
						}

						//#region Configure Cases
						function configureCases() {
							divCasesConstructor.querySelectorAll(`div[id^="case-group-"]`).forEach(element => {
								element.remove();
							});
							pollConstruct.cases.forEach((caseConstruct, caseIndex) => {
								const divCaseGroup = divCasesConstructor.insertBefore(document.createElement(`div`), formInsertCaseGroup);
								divCaseGroup.id = `case-group-${caseIndex}`;
								divCaseGroup.classList.add(`contents`);
								{
									const divCase = divCaseGroup.appendChild(document.createElement(`div`));
									divCase.classList.add(`case`);
									divCase.style.gridColumn = `1 / 2`;
									{
										const inputCaseMark = divCase.appendChild(document.createElement(`input`));
										inputCaseMark.id = `case-mark-${pollIndex}-${caseIndex}`;
										inputCaseMark.type = `radio`;
										inputCaseMark.name = `poll-${pollIndex}`;
										inputCaseMark.checked = (caseIndex == pollConstruct.answer);
										inputCaseMark.hidden = true;
										inputCaseMark.addEventListener(`change`, (event) => {
											pollConstruct.answer = caseIndex;
										});
										{ }
										const labelCaseMark = divCase.appendChild(document.createElement(`label`));
										labelCaseMark.htmlFor = inputCaseMark.id;
										labelCaseMark.role = `combobox`;
										labelCaseMark.classList.add(`flex`);
										{
											const imgIcon = labelCaseMark.appendChild(document.createElement(`img`));
											imgIcon.src = `../resources/checkbox.png`;
											imgIcon.alt = `Mark`;
											imgIcon.classList.add(`icon`, `in-line`);
											{ }
										}
										const inputCase = divCase.appendChild(document.createElement(`input`));
										inputCase.type = `text`;
										inputCase.required = true;
										inputCase.value = caseConstruct;
										// inputCase.classList.add(`case`);
										inputCase.addEventListener(`change`, (event) => {
											caseConstruct = inputCase.value;
										});
										// inputCase.style.wordBreak = `break-all`;
										// inputCase.innerText = caseConstruct;
										{ }
									}
									const buttonDeleteCase = divCaseGroup.appendChild(document.createElement(`button`));
									buttonDeleteCase.classList.add(`flex`);
									buttonDeleteCase.style.gridColumn = `-2 / -1`;
									buttonDeleteCase.style.alignItems = `center`;
									buttonDeleteCase.addEventListener(`click`, async (event) => {
										if (await Application.confirm(`The case cannot be restored. Are you sure?`, MessageType.warn)) {
											pollConstruct.cases.splice(caseIndex, 1);
											configureCases();
										}
									});
									{
										const imgIcon = buttonDeleteCase.appendChild(document.createElement(`img`));
										imgIcon.src = `../resources/close.png`;
										imgIcon.classList.add(`icon`, `in-line`);
										{ }
									}
								}
							});
						}
						//#endregion

						configureCases();
					}
				}
				const buttonDeletePoll = divPollGroup.appendChild(document.createElement(`button`));
				buttonDeletePoll.classList.add(`flex`);
				buttonDeletePoll.style.gridColumn = `-2 / -1`;
				buttonDeletePoll.style.alignItems = `center`;
				buttonDeletePoll.addEventListener(`click`, async (event) => {
					if (await Application.confirm(`The poll cannot be restored. Are you sure?`, MessageType.warn)) {
						sheetConstruct.polls.splice(pollIndex, 1);
						configurePolls();
					}
				});
				{
					const imgIcon = buttonDeletePoll.appendChild(document.createElement(`img`));
					imgIcon.classList.add(`icon`);
					imgIcon.src = `../resources/delete.png`;
					{ }
				}
			}
		});
		//#endregion
	}

	configurePolls();

	const buttonSave = (/** @type {HTMLButtonElement} */ (document.querySelector(`button#save`)));
	buttonSave.addEventListener(`click`, async (event) => {
		try {
			const sheet = Sheet.import(sheetConstruct);
			archiveSheets.change((data) => [...data, { date: Date.now(), sheet: Sheet.export(sheet) }]);
			await Application.alert(`Sheet assembled and saved successfully.`);
			location.assign(`./menu.html`);
		} catch (exception) {
			await Application.alert(`An attempt to assemble the sheet failed. Cause:\n${exception instanceof Error ? exception.stack ?? `${exception.name}: ${exception.message}` : `Invalid exception type.`}.`, MessageType.warn);
		}
	});
} catch (exception) {
	Application.prevent(exception);
}