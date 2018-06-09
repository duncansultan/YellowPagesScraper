const fs = require('mz/fs');
const path = require('path');
const stringify = require('csv-stringify');
const parse = require('csv-parse');
const transform = require('stream-transform');
const Address = require('./models/Address');
const csvExtFilter = require('./utilities/pathExtFilters').csv;
const geocode = require('./utilities/geocode');

/** 
 * @function parseCsvToAddresses - Parse Csv File into Addresses.
 * @param {string} file - File path.
 * @returns {object[]} - Array of Address Objects.
 * @async
 * @private
 * @requires mz/fs
 * @requires csv-parse/lib/sync
 */
const parseCsvToAddresses = (file) => {
	return new Promise((resolve, reject) => {
		console.group(`<parseCsvToAddresses> - Start parsing file ${file}`);

		const data = [];
		fs.createReadStream(file).pipe(parse({ columns: true })).pipe(transform((record, callback) => {
			callback(null, new Address(record.Name, record.Address));
		}, { parallel: 100 }))
			.on('data', (row) => {
				data.push(row);
			})
			.on('error', e => {
				console.groupEnd();
				reject(e);
			})
			.on('end', () => {
				console.info(`<parseCsvToAddresses> - Finished parsing file ${file} to ${data.length} addresses.`);
				console.groupEnd();
				resolve(data);
			});
	});
};

/**
 * @function addressFilter - Filter address objects by criteria.
 * @param {object} address - Address object.
 * @returns {boolean} - Is filtered.
 * @private
 */
const addressFilter = (address) => {
	let isPoBox = address.Address1.includes('PO Box') || address.Address1.includes('P O Box');
	return !isPoBox;
};

/**
 * @function geocodeAddresses - Geocode Addresses.
 * @param {object[]} addresses - Array of Address Objects.
 * @returns {object[]} - Array of Address Objects.
 * @async
 * @private
 * @requires mz/fs
 * @requires ./utilities/geocode
 */
const geocodeAddresses = async (addresses) => {
	console.group(`<geocodeAddresses> - Start Geocoding ${addresses.length} addresses.`);

	let geocoded = [];

	for (const address of addresses.filter(addressFilter)) {
		await geocode(address);
		geocoded.push(address);
		//ToDo: Consider Writing Csv Records here for better performance and fault tolerance.
	}

	console.groupEnd();

	return geocoded;
};

/**
 * @function processFile - Process and Geocode file.
 * @param {string} inputFile - Input file.
 * @param {string} outputFile - Output file.
 * @async
 * @private
 * @requires mz/fs
 * @requires csv-stringify
 */
const processFile = async (inputFile, outputFile) => {
	console.group(`<processFile> - Start Processing file ${inputFile}.`);

	let addresses = await parseCsvToAddresses(inputFile);
	let geocoded = await geocodeAddresses(addresses);

	return new Promise((resolve, reject) => {
		stringify(geocoded, { header: true }, async (err, output) => {

			await fs.appendFile(outputFile, output, (err) => {
				if (err) reject(err);
			});

			console.info(`<processFile> - Saved ${output.length} characters to ${outputFile}`);
			console.groupEnd();

			//ToDo Move file to history

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

		console.log(`<run> - Finished Processing file ${fileBase}.`);
		console.groupEnd();
	}
};

(async () => {
	const inputPath = 'output\\yp_export\\wait';
	const outputPath = 'output\\geocoded';

	await run(inputPath, outputPath);
})();