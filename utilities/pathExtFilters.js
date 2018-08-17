const path = require("path");

module.exports = {
  /**
   * @function csv - Filter paths with *.csv extension.
   * @param {Object} file - The file.
   * @returns {boolean} - Is valid file extension.
   * @public
   * @example somefile.csv
   * @requires path
   */

  csv: file => {
    const extName = path.extname(file);
    return extName === ".csv";
  },
  /**
   * @function json - Filter paths with *.json extension.
   * @param {Object} file - The file.
   * @returns {boolean} - Is valid file extension.
   * @public
   * @example somefile.json
   * @requires path
   */

  json: file => {
    const extName = path.extname(file);
    return extName === ".json";
  }
};
