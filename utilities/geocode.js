//https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');
superagentJsonapify(superagent);

/** 
 * @function geocode - Geocode address using Us Census Bureau Api.
 * @see http://lance.bio/2018/05/11/geocoding-with-us-census-bureau/
 * @param {object} address - Address Object.
 * @param {object} address - Address Object with Geocoding.
 * @public
 * @requires superagent
 * @requires superagent-jsonapify
 */
const geocode = async (address) => {
	console.group(`<geocode> - Geocode address: ${address.FullAddress.fullAddress}`);
	//console.info(address);

	await superagent
		.get('https://geocoding.geo.census.gov/geocoder/locations/address')
		.query({
			format: 'json',
			benchmark: 'Public_AR_Current',
			street: address.Address1,
			city: address.City,
			state: address.State
		})
		.then(function (response) {
			const body = response.body;
			const addressMatches = body.result.addressMatches;

			let coordinates = {
				'longitude': addressMatches.length ? addressMatches[0].coordinates.x : '',
				'latitude': addressMatches.length ? addressMatches[0].coordinates.y : ''
			};

			console.info(coordinates);
			console.groupEnd(`<geocode> - Geocode address: ${address.FullAddress}`);
			
			address.Latitude = coordinates.latitude;
			address.Longitude = coordinates.longitude;
										
			return address;           
		})
		.catch(error => {
			console.error('<geocode> - Geocoding failed.');
			console.error(error);
			console.groupEnd(`<geocode> - Geocode address: ${address.FullAddress}`);
		});
};

module.exports = geocode; 