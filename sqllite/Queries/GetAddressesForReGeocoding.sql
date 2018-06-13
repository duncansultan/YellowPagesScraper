SELECT Geocoded.Id, Geocoded.FullName, Geocoded.Address1, Geocoded.Address2, Geocoded.City, Geocoded.State, Geocoded.Zip 
FROM Geocoded 
INNER JOIN Names 
	ON Names.Name = Geocoded.LastName
WHERE Geocoded.Latitude = '' 
	AND Geocoded.FullAddress NOT LIKE 'PO Box%' 
	AND Geocoded.FullAddress NOT LIKE 'P O Box%'
	AND Names.IsValid = 1
ORDER BY Geocoded.State