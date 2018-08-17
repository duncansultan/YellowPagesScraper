/** Class representing an Alba Import record. */
module.exports = class AlbaImport {
  /**
   * Create a search parameter.
   * @param {string} fullName - The full name value.
   * @param {string} address1 - The address1 value.
   * @param {string} address2 - address2 zip value.
   * @param {string} city - The city value.
   * @param {string} state - The state value.
   * @param {string} zip - The zip value.
   * @param {string} latitude - The latitude value.
   * @param {string} longitude - The longitude value.
   */
  constructor(
    fullName,
    address1,
    address2,
    city,
    state,
    zip,
    latitude,
    longitude
  ) {
    this.Address_ID = "";
    this.Territory_ID = "";
    this.Language = "Swahili";
    this.Status = "New";
    this.Name = fullName;
    this.Suite = address2;
    this.Address = address1;
    this.City = city;
    this.Province = state;
    this.Postal_code = zip;
    this.Country = "USA";
    this.Latitude = latitude;
    this.Longitude = longitude;
    this.Telephone = "";
    this.Notes = "";
    this.Notes_private = `YellowPages.com - ${new Date()
      .toISOString()
      .slice(0, 10)}`;
  }
};
