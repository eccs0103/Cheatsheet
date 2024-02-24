# Cheatsheet
A program for solving tests.
- - -
## Guide
To use the program, a sheet is required. The sheet must be a JSON file with the following structure:
```js
{
	"title": String,
	"polls": Array<{
		"question": String,
		"answer": Number,
		"cases": String | Array<String>,
	}>,
}
```
...and can be loaded from the device or imported using a link.
- - -
## Feed
### Update 2.0.0 (24.02.2024) : AWT 2.5.2
- Core updated.
- Processes accelerated with asynchronous operations.
- Website structure improved.
- Image preloading added.

### Update 1.3.5 (13.04.2023)
- Improved list validation.
- Enhanced group management.

### Update 1.2.8 (04.04.2023)
- Core updated.
- Preparation for the introduction of a new structure.

### Update 1.2.5 (05.03.2023)
- Theme management added.
- Various errors fixed.

### Update 1.2.4 (15.02.2023)
- HTML structure improved.
- Group management functionality enhanced.
- Smartphone adaptability issue fixed.
- Case sensitivity control during search added.
- Quick search feature improved.
- Settings reset option added.
- Information list updated.
- CSS structure improved.
- Adaptive theme integrated.
- Modules rewritten.
- JavaScript structure optimized.
- Data loading from cloud and device improved.
- Unstable functions removed.
- Settings stability improved during updates.
- Error descriptions improved.

### Update 1.1.10 (13.01.2023)
- Search speed improved with data preloading.
- Sheet scanning accelerated with data preloading.
- Group management enhanced.
- Popup style changed.

### Update 1.1.7 (12.01.2023)
- Settings display error fixed.
- Sheet display improved; issue preventing sheet opening resolved.
- Ability to download local sheets added.
- Group management feature added.
- Multiple sheet upload from device enabled.

### Update 1.1.4 (11.01.2023)
- Single-choice questions can now be directly passed as a string in JSON format. The correct answer number should correspond to index 0.
- Sheet scanning method improved.
- Date input during sheet creation automated upon import.
- Question and answer display enhanced.
- Support for old sheet formats discontinued; automatic conversion to new format.

### Update 1.1.0 (02.01.2023)
- Design revamped.
- Ability to upload sheets from device added.
- Minor bugs fixed.
- Error handling system improved.

### Update 1.0.2 (24.12.2022)
- Metadata updated.
- Design slightly refreshed.

### Update 1.0.0 (21.12.2022)
- Design adapted for mobile devices, tablets, and computers.
- Ability to delete sheets added.
- Scroll bar style changed.

