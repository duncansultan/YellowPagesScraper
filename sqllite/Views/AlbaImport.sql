CREATE VIEW AlbaImport AS
SELECT '' AS Address_ID,
	'' AS Territory_ID,
	'Swahili' AS LANGUAGE,
	'New' AS STATUS,
	Geocoded.FullName AS [Name],
	Geocoded.Address2 AS Suite,
	Geocoded.Address1 AS Address,
	Geocoded.City AS City,
	Geocoded.STATE AS Province,
	Geocoded.Zip AS Postal_code,
	'USA' AS Country,
	Geocoded.Latitude AS Latitude,
	Geocoded.Longitude AS Longitude,
	'' AS Telephone,
	'' AS Notes,
	'YellowPages.com - 2018-06-09' AS Notes_private
FROM Geocoded