const fs = require('mz/fs');
const path = require('path');
const stringify = require('csv-stringify');
const csvParse = require('csv-parse/lib/sync');
const AlbaImport = require('./models/AlbaImport');
const csvExtFilter = require('./utilities/pathExtFilters').csv;

/** 
 * @function transform - Transform Addresses into Alba Imports.
 * @param {string[]} input- Array of Address Objects.
 * @returns {object[]} - Array of Alba Import Objects.
 * @private
 * @requires ./Models/AlbaImport
 */
const transform = (input) => {
	let output = [];

	input.forEach(record => {
		let albaImport = new AlbaImport(record.FullName, 
			record.Address1,
			record.Address2, 
			record.City, 
			record.State, 
			record.Zip, 
			record.Latitude, 
			record.Longitude);
		output.push(albaImport);
	});

	return output;
};

/** 
 * @function parseCsvToAlbaImportRecords - Parse Csv File into Alba Import records.
 * @param {string} file - File path.
 * @returns {object[]} - Array of Alba Import Objects.
 * @async
 * @private
 * @requires mz/fs
 * @requires csv-parse/lib/sync
 */
const parseCsvToAlbaImportRecords = async (file) => {
	console.group(`<parseCsvToAlbaImportRecords> - Start parsing file ${file}`);

	let input = await fs.readFile(file);
	let records = csvParse(input, { columns: true });
	let output = transform(records);

	console.info(`<parseCsvToAddresses> - Finished parsing file ${file} to ${output.length} Alba Import records.`);
	console.groupEnd();

	return output;
};

/**
 * @function processFile - Process file.
 * @param {string} inputFile - Input file.
 * @param {string} outputFile - Output file.
 * @async
 * @private
 * @requires mz/fs
 * @requires csv-stringify
 */
const processFile = async (inputFile, outputFile) => {
	console.group(`<processFile> - Start Processing file ${inputFile}.`);

	let albaImportRecords = await parseCsvToAlbaImportRecords(inputFile);

	return new Promise((resolve, reject) => {
		stringify(albaImportRecords, { header: true }, async (err, output) => {

			await fs.appendFile(outputFile, output, (err) => {
				if (err) reject(err);
			});

			console.info(`<processFile> - Saved ${output.length} characters to ${outputFile}`);
			console.groupEnd();
			
			resolve(output);
		});
	});
};

/**
 * @function run - Process files for Geocoding.
 * @param {string} inputPath - Input path.
 * @param {string} outputPath - Output path.
 * @async
 * @public
 * @requires mz/fs
 * @requires path
 * @requires ./Utilities/pathExtFilters
 */
const run = async (inputPath, outputPath) => {
	const files = (await fs.readdir(inputPath)).filter(csvExtFilter);

	for (const fileBase of files) {
		console.log(`<run> - Start Processing file ${fileBase}.`);

		let inputFile = path.format({
			root: '/ignored',
			dir: inputPath,
			base: fileBase
		});

		let outputBaseName = path.basename(fileBase, path.extname(fileBase));
		let outputFile = path.format({
			root: '/ignored',
			dir: outputPath,
			name: outputBaseName,
			ext: '.csv'
		});

		await processFile(inputFile, outputFile);

		let movedFile = path.format({
			root: '/ignored',
			dir: `${inputPath}\\history`,
			base: fileBase
		});
	
		await fs.rename(inputFile, movedFile);
		console.info(`<run> - Moved file from ${inputFile} to ${movedFile}`);

		console.groupEnd();

		console.log(`<run> - Finished Processing file ${fileBase}.`);
		console.groupEnd();
	}
};

(async () => {
	const inputPath = 'output\\geocoded';
	const outputPath = 'output\\alba';

	await run(inputPath, outputPath);
})();