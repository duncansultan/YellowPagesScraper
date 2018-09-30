CREATE VIEW AddressesForReGeocoding AS
SELECT Geocoded.Id,
	Geocoded.FullName,
	Geocoded.Address1,
	Geocoded.Address2,
	Geocoded.City,
	Geocoded.STATE,
	Geocoded.Zip
FROM Geocoded
INNER JOIN NAMES ON NAMES.Name = Geocoded.LastName
WHERE Geocoded.Latitude = ''
	AND Geocoded.FullAddress NOT LIKE 'PO Box%'
	AND Geocoded.FullAddress NOT LIKE 'P O Box%'
	AND NAMES.IsValid = 1
ORDER BY Geocoded.STATE