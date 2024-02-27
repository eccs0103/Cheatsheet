/// <reference path="../Modules/Extensions.js" />
/// (?<!throws )\{[\w<>\[\]]+\} 

interface NumberConstructor {
	/**
	 * Imports a number from the source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported number.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a number.
	 */
	import(source: unknown, name?: string): number;
}

interface Number {
	/**
	 * Exports the number value.
	 * @returns The exported number.
	 */
	export(): number;
}

interface BooleanConstructor {
	/**
	 * Imports a boolean from the source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported boolean.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a boolean.
	 */
	import(source: unknown, name?: string): boolean;
}

interface Boolean {
	/**
	 * Exports the boolean value.
	 * @returns The exported boolean.
	 */
	export(): boolean;
}

interface StringConstructor {
	/**
	 * Imports a string from the source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported string.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not a string.
	 */
	import(source: unknown, name?: string): string;
}

interface String {
	/**
	 * Exports the string value.
	 * @returns The exported string.
	 */
	export(): string;
}

interface Function {
	/**
	 * Not implemented function to import source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported value.
	 * @throws {ReferenceError} If the function is called.
	 */
	import(source: unknown, name?: string): any;
	/**
	 * Not implemented function to export source.
	 * @returns The exported value.
	 * @throws {ReferenceError} If the function is called.
	 */
	export(): any;
}

interface ObjectConstructor {
	/**
	 * Imports an object from the source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported object.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not an object or is null.
	 */
	import(source: unknown, name?: string): Object;
}

interface Object {
	/**
	 * Exports the object value.
	 * @returns The exported object.
	 */
	export(): Object;
}

interface ArrayConstructor {
	/**
	 * Imports an array from the source.
	 * @param source The source to import.
	 * @param name The name of the source.
	 * @returns The imported array.
	 * @throws {ReferenceError} If the source is undefined.
	 * @throws {TypeError} If the source is not an array or if any element cannot be imported.
	 */
	import(source: unknown, name?: string): any[];
}

interface Array<T extends Function> {
	/**
	 * Exports the array value.
	 * @returns The exported array.
	 */
	export(): T[];
}

interface Math {
	/**
	 * Clamps a value between a minimum and maximum value.
	 * @param value The value to be clamped.
	 * @param min The minimum allowed value.
	 * @param max The maximum allowed value.
	 * @returns The clamped value.
	 */
	between(value: number, min: number, max: number): number;
	/**
	 * Converts radians to degrees.
	 * @param radians The angle in radians.
	 * @returns The equivalent angle in degrees.
	 */
	toDegrees(radians: number): number;
	/**
	 * Converts degrees to radians.
	 * @param degrees The angle in degrees.
	 * @returns The equivalent angle in radians.
	 */
	toRadians(degrees: number): number;
	/**
	 * Converts a value to a factor within the range [0, 1] based on a specified period.
	 * @param value The value to convert.
	 * @param period The period to use for conversion.
	 * @returns The converted factor within the range [0, 1].
	 */
	toFactor(value: number, period: number): number;
	/**
	 * Converts a value to a factor within the range [0, 1] based on a specified period.
	 * @param value The value to convert.
	 * @param period The period to use for conversion.
	 * @returns The converted factor within the range [0, 1].
	 */
	toSignedFactor(value: number, period: number): number;
}

interface PromiseConstructor {
	/**
	 * @template T
	 * @param action The action to execute.
	 * @returns A promise that resolves with the result of the action.
	 */
	fulfill<T>(action: () => T | PromiseLike<T>): Promise<T>;
}

interface ErrorConstructor {
	/**
	 * @param error The error object to generate.
	 * @returns The generated error object.
	 */
	generate(error: any): Error;
}

interface Error {
	/**
	 * Returns a descriptive string.
	 * @returns A descriptive string representing the error.
	 */
	toString(): string;
}

interface Element {
	/**
	 * Retrieves an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getElement<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElement<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves the closest ancestor element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getClosest<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve the closest ancestor element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetClosest<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @returns The NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type.
	 */
	getElements<T extends typeof Element>(type: T, selectors: string): NodeListOf<InstanceType<T>>;
	/**
	 * Tries to retrieve elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @param strict Whether to reject if any element is missing or has an invalid type.
	 * @returns A promise that resolves to the NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElements<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<NodeListOf<InstanceType<T>>>;
}

interface Document {
	/**
	 * Retrieves an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @returns The element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type.
	 */
	getElement<T extends typeof Element>(type: T, selectors: string): InstanceType<T>;
	/**
	 * Tries to retrieve an element of the specified type and selectors.
	 * @template T
	 * @param type The type of element to retrieve.
	 * @param selectors The selectors to search for the element.
	 * @param strict Whether to reject if the element is missing or has an invalid type.
	 * @returns A promise that resolves to the element instance.
	 * @throws {TypeError} If the element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElement<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<InstanceType<T>>;
	/**
	 * Retrieves elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @returns The NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type.
	 */
	getElements<T extends typeof Element>(type: T, selectors: string): NodeListOf<InstanceType<T>>;
	/**
	 * Tries to retrieve elements of the specified type and selectors.
	 * @template T
	 * @param type The type of elements to retrieve.
	 * @param selectors The selectors to search for the elements.
	 * @param strict Whether to reject if any element is missing or has an invalid type.
	 * @returns A promise that resolves to the NodeList of element instances.
	 * @throws {TypeError} If any element is missing or has an invalid type and strict mode is enabled.
	 */
	tryGetElements<T extends typeof Element>(type: T, selectors: string, strict?: boolean): Promise<NodeListOf<InstanceType<T>>>;
}

interface Window {
	/**
	 * Gets the type name of a value.
	 * @param value The value to get the type name of.
	 * @returns The type name of the value.
	 */
	typename(value: unknown): string;
	/**
	 * Retrieves the data path based on developer and application name metadata.
	 * @returns The data path.
	 */
	getDataPath(): string;
	/**
	 * Asynchronously displays an alert message.
	 * @param message The message to display.
	 * @param title The title of the alert.
	 * @returns A promise that resolves when the alert is closed.
	 */
	alertAsync(message: string, title?: string): Promise<void>;
	/**
	 * Asynchronously displays a confirmation dialog.
	 * @param message The message to display.
	 * @param title The title of the confirmation dialog.
	 * @returns A promise that resolves to true if the user confirms, and false otherwise.
	 */
	confirmAsync(message: string, title?: string): Promise<boolean>;
	/**
	 * Asynchronously displays a prompt dialog.
	 * @param message The message to display.
	 * @param title The title of the prompt dialog.
	 * @returns A promise that resolves to the user's input value if accepted, or null if canceled.
	 */
	promptAsync(message: string, title?: string): Promise<string?>;
	/**
	 * Asynchronously loads a promise with a loading animation.
	 * @template T
	 * @param promise The promise to load.
	 * @param duration The duration of the loading animation.
	 * @param delay The delay before the loading animation starts.
	 * @returns A promise that resolves to the result of the input promise.
	 */
	load<T>(promise: Promise<T>, duration?: number, delay?: number): Promise<T>;
	/**
	 * Asynchronously handles an error, displaying it in an alert.
	 * @param error The error to handle.
	 * @param reload Indicates whether the application should be reloaded after displaying the error.
	 * @returns A promise that resolves once the error handling is complete.
	 */
	stabilize(error: Error, reload?: boolean): Promise<void>;
}

/**
 * Gets the type name of a value.
 * @param value The value to get the type name of.
 * @returns The type name of the value.
 */
declare function typename(value: unknown): string;
/**
 * Retrieves the data path based on developer and application name metadata.
 * @returns The data path.
 */
declare function getDataPath(): string;
/**
 * Asynchronously displays an alert message.
 * @param message The message to display.
 * @param title The title of the alert.
 * @returns A promise that resolves when the alert is closed.
 */
declare function alertAsync(message: string, title?: string): Promise<void>;
/**
 * Asynchronously displays a confirmation dialog.
 * @param message The message to display.
 * @param title The title of the confirmation dialog.
 * @returns A promise that resolves to true if the user confirms, and false otherwise.
 */
declare function confirmAsync(message: string, title?: string): Promise<boolean>;
/**
 * Asynchronously displays a prompt dialog.
 * @param message The message to display.
 * @param title The title of the prompt dialog.
 * @returns A promise that resolves to the user's input value if accepted, or null if canceled.
 */
declare function promptAsync(message: string, title?: string): Promise<string?>;
/**
 * Asynchronously loads a promise with a loading animation.
 * @template T
 * @param promise The promise to load.
 * @param duration The duration of the loading animation.
 * @param delay The delay before the loading animation starts.
 * @returns A promise that resolves to the result of the input promise.
 */
declare function load<T>(promise: Promise<T>, duration?: number, delay?: number): Promise<T>;
/**
 * Asynchronously handles an error, displaying it in an alert or console.
 * @param error The error to handle.
 * @param locked Indicates whether the application should be locked after displaying the error.
 * @returns A promise that resolves once the error handling is complete.
 */
declare function stabilize(error: Error, locked?: boolean): Promise<void>;

interface Navigator {
	/**
	 * Downloads the specified file.
	 * @param file The file to download.
	 */
	download(file: File): void;
}

interface Location {
	/**
	 * Parses the search part of the URL and returns it as a map.
	 * @returns A map containing the search parameters.
	 */
	getSearchMap(): Map<string, string>;
}