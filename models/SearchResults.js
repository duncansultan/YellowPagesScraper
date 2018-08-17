/** Class representing a set of search results. */
module.exports = class SearchResults {
  /**
   * Create a set of search results.
   * @param {Object} param - The param value.
   * @param {[Object]} results - The results value.
   */
  constructor(param, results) {
    this.param = param;
    this.results = results;
  }
};
