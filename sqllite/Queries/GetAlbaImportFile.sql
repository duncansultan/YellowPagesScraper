SELECT 	NULL AS Address_ID,
		NULL AS Territory_ID,
		'Swahili' AS Language,
		'New' AS Status,
		g.FullName AS Name,
		g.Address2 AS Suite,
		g.Address1 AS Address,
		g.City AS City,
		g.State AS Province,
		g.Zip AS Postal_code,
		'USA' AS Country,
		g.Latitude AS Latitude,
		g.Longitude AS Longitude,
		NULL AS Telephone,
		NULL AS Notes,
		'YellowPages.com - 2018-06-09' AS Notes_private
FROM Geocoded g
INNER JOIN Names n
	ON g.LastName = n.Name
WHERE n.IsValid = 1
	--AND g.State = 'AL'
ORDER BY g.State,
	g.City