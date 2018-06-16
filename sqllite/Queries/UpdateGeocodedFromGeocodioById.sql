UPDATE Geocoded
SET Longitude =
    (SELECT Longitude
     FROM Geocodio
     WHERE (Geocoded.Id) = (Geocodio.Id))
WHERE (Id) IN (SELECT Id FROM Geocodio)
	/* Check for changed value */
	AND Longitude <> 
	(SELECT Longitude
	 FROM Geocodio
	 WHERE (Geocoded.Id) = (Geocodio.Id));

UPDATE Geocoded
SET Latitude =
    (SELECT Latitude 
     FROM Geocodio
     WHERE (Geocoded.Id) = (Geocodio.Id))
WHERE (Id) IN (SELECT Id FROM Geocodio)
	/* Check for changed value */
	AND Latitude <> 
	(SELECT Latitude
	 FROM Geocodio
	 WHERE (Geocoded.Id) = (Geocodio.Id));

UPDATE Geocoded
SET Zip =
    (SELECT Zip
     FROM Geocodio
     WHERE (Geocoded.Id) = (Geocodio.Id))
WHERE (Id) IN (SELECT Id FROM Geocodio)
	/* Check for changed value */
	AND Zip <> 
	(SELECT Zip
	 FROM Geocodio
	 WHERE (Geocoded.Id) = (Geocodio.Id));