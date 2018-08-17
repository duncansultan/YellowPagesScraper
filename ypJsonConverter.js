/* eslint no-restricted-syntax: ["warn", "ForOfStatement"], no-await-in-loop: ["off"], no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const fs = require("mz/fs");
const path = require("path");
const JSONStream = require("JSONStream");
const Json2csvParser = require("json2csv").Parser;
const jsonExtensionFilter = require("./utilities/pathExtFilters").json;

/**
 * @function convert - Convert json file to csv file.
 * @param {string} inputFile - The input file.
 * @param {string} outputFile - The output file.
 * @private
 * @async
 * @requires mz/fs
 * @requires JSONStream
 * @requires Json2csvParser
 */
const convert = async (inputFile, outputFile) => {
  console.log(
    `<convert> - Start Converting Json file ${inputFile} to CSV file ${outputFile}`
  );

  // Write Csv Header
  await fs.appendFile(outputFile, '"Name","Address"\r\n');

  const stream = fs.createReadStream(inputFile, { encoding: "utf8" });
  const jsonParser = JSONStream.parse("*.results");

  jsonParser.on("data", async json => {
    const json2csvParser = new Json2csvParser({
      fields: ["title", "address"],
      header: false
    });
    const csvData = json2csvParser.parse(json);

    await fs.appendFile(outputFile, `${csvData}\r\n`);
  });

  console.groupEnd();
  await stream.pipe(jsonParser);
};

/**
 * @function run - Run conversion of Json files to Csv files.
 * @param inputPath - The input path.
 * @param outputPath - The output path.
 * @async
 * @public
 * @requires mz/fs
 * @requires path
 * @requires ./utilities/pathExtFilters
 */
const run = async (inputPath, outputPath) => {
  const files = (await fs.readdir(inputPath)).filter(jsonExtensionFilter);

  console.group(`<run> - Start Converting ${files.length} files to csv.`);

  for (const fileBase of files) {
    console.group(`<run> - Start Converting ${fileBase} to csv.`);

    const inputFile = path.format({
      root: "/ignored",
      dir: inputPath,
      base: fileBase
    });

    const outputBaseName = path.basename(fileBase, path.extname(fileBase));
    const outputFile = path.format({
      root: "/ignored",
      dir: outputPath,
      name: outputBaseName,
      ext: ".csv"
    });

    await convert(inputFile, outputFile);

    const movedFile = path.format({
      root: "/ignored",
      dir: `${inputPath}\\history`,
      base: fileBase
    });

    await fs.rename(inputFile, movedFile);
    console.info(`<run> - Moved file from ${inputFile} to ${movedFile}`);

    console.groupEnd();
  }

  console.groupEnd();
};

(async () => {
  const inputPath = "output\\yp_json_response";
  const outputPath = "output\\yp_export";

  await run(inputPath, outputPath);
})();
