/* eslint no-restricted-syntax: ["warn", "ForOfStatement"], no-await-in-loop: ["off"], no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const fs = require("mz/fs");
const path = require("path");
const Xray = require("x-ray");

const x = Xray()
  .concurrency(1)
  .throttle(1, 500)
  .timeout(10000);
const SearchParam = require("./models/SearchParam");
const SearchResults = require("./models/SearchResults");

/**
 * @function getUrl - Get Search Url.
 * @param {Object} param - The crawl parameter.
 * @private
 * @returns {string} - Search Url for people.yellowpages.com
 * @example https://people.yellowpages.com/whitepages?first=&last=kimani&zip=&state=tx&page=1&site=
 */
const getUrl = param =>
  `https://people.yellowpages.com/whitepages/?first_name=${
    param.first
  }&last_name=${param.last}&zip=${param.zip}&state=${param.state}`;
//https://people.yellowpages.com/whitepages/?first_name=&last_name=Ramzan&zip=&state=TX
//https://people.yellowpages.com/whitepages?first=&last=Ramzan&zip=&state=TX&page=1&site=
/**
 * @function transform - Transform Search Results.
 * @param {string[]} input- Array of Json Search Results.
 * @returns {string[]} - Array of Transformed Json Search Results.
 * @private
 */
const transform = input => {
  // Remove the first empty cell
  for (let i = 0; i < input.length; ++i) {
    if (!input[i].title) {
      input.splice(i, 1);
    }
  }

  // Remove line breaks and trim empty whitespace
  for (let i = 0; i < input.length; ++i) {
    // eslint-disable-next-line no-param-reassign
    input[i].title = input[i].title.replace(/(\r\n|\n|\r)/gm, "").trim();
  }

  return input;
};

/**
 * @function crawl - Crawl people.yellowpages.com/whitepages for a search param.
 * @param {Object} param - The crawl parameter.
 * @returns {string[]} - Array of Json Search Results.
 * @private
 * @async
 * @requires x-ray
 */
const crawl = async param =>
  new Promise(async (resolve, reject) => {
    const url = getUrl(param);

    console.group(`<crawl> - Start ${url}`);

    await x(url, ".phone-result", [
      {
        title: ".fullname@html",
        address: ".address"
      }
    ])
      // .paginate(".paginator a@href")
      .limit(10)((err, obj) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.info(`<crawl> - ${obj.length} results`);
      console.groupEnd();
      resolve(obj);
    });
  });

/**
 * @function saveJson - Save Json to file.
 * @param {Object[]} data - The data to save.
 * @param {string} file - The crawl parameter.
 * @private
 * @async
 * @requires mz/fs
 */
const saveJson = async (data, file) => {
  console.group(`<saveJson> - Save Json to Csv file ${file}.`);

  let json = JSON.stringify(data, null, 2);
  // Add comma and line break
  json += ", \r\n";

  await fs.appendFile(file, json);

  console.groupEnd();
  return "done";
};

/**
 * @function run - Run searches for a state or zip.
 * @param {string} state - State to search.
 * @param {string} zip - Zip code to search.
 * @public
 * @async
 * @requires mz/fs
 * @requires path
 * @requires ./Models/SearchParam
 * @requires ./Models/SearchResults
 */
const run = async (state, zip) => {
  const names = await fs
    .readFileSync("config\\names.txt")
    .toString()
    .split("\r\n");

  const params = names.map(str => new SearchParam(str, state, zip));

  const outputPath = "output\\yp_json_response";
  const outputFile = path.format({
    root: "/ignored",
    dir: outputPath,
    name: state,
    ext: ".json"
  });

  console.group(
    `<process> - Start Search for State ${state} Zip ${zip} with ${
      names.length
    } names to file ${outputFile}.`
  );
  await saveJson("[", outputFile);

  for (const param of params) {
    const result = await crawl(param);
    if (!result) {
      console.info("<process> - Skipped saving empty set of records.");
      return;
    }

    const output = transform(result);
    const data = new SearchResults(param, output);

    console.info(
      `<process> - Process ${data.results.length} records to ${outputFile}`
    );

    await saveJson(data, outputFile);
  }

  await saveJson("]", outputFile);
  console.groupEnd();
};

(async () => {
  // Use to Change Search Criteria
  const state = "TX";
  const zip = "Dallas";
  await run(state, zip);
})();
