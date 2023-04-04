"use strict";
const settings = Settings.import(archiveSettings.data);
document.documentElement.dataset[`theme`] = settings.theme;