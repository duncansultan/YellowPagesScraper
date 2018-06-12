/** Class representing an address search result. */
module.exports = class Address {
	/**
     * Create a address search result.
     * @param {string} fullName - The full name value. 
     * @param {string} fullAddress - The full address value.
     */
	//ToDo Add error handling ehre
	constructor(fullName, fullAddress) {
		this.FullName = fullName;
		this.FullAddress = fullAddress;
		this.FirstName = fullAddress && (fullName.split(' ').slice(0, 1).join(' ') || '').trim();
		this.LastName = fullAddress && (fullName.split(' ').reverse().slice(0, 1).join(' ') || '').trim();
		this.Address1 = fullAddress && (fullAddress.split(',').slice(0, 1).pop().split('#').slice(0, 1).pop() || fullAddress.split(',').slice(0, -2).pop()).trim();
		this.Address2 = fullAddress && (fullAddress.split(',').slice(0, 1).pop().split('#').slice(1, 2).pop() || '').trim();
		this.City = fullAddress && (fullAddress.split(',').slice(1, 2).pop() || '').trim();
		this.State = fullAddress && fullAddress.substr(fullAddress.length - 8, 2);
		this.Zip = fullAddress && fullAddress.substr(fullAddress.length - 5);
		this.Latitude = null;
		this.Longitude = null;
	}
};