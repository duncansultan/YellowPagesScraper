/** Class representing a search parameter. */
module.exports = class SearchParam {
	/**
     * Create a search parameter.
     * @param {string} first - The first value.
     * @param {string} last - The last value.
     * @param {string} zip - The zip value.
     * @param {string} state - The state value.
     * @param {string} site - The site value.
     * @param {number} page - The page value.
     */
	constructor(last, state, zip) {
		this.first = '';
		this.last = last;
		this.zip = zip;
		this.state = state;
		this.site = '';
		this.page = 1;
	}
};