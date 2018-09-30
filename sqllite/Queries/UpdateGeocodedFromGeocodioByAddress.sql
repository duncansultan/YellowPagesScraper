UPDATE Geocoded
SET Latitude = (
		SELECT Latitude
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		)
WHERE (
		FullName,
		Address1,
		Address2,
		City,
		[State]
		) IN (
		SELECT FullName,
			Address1,
			Address2,
			InputCity,
			Input[State]
		FROM Geocodio
		)
	/* Check for changed value */
	AND Latitude <> (
		SELECT Latitude
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		);

UPDATE Geocoded
SET Longitude = (
		SELECT Longitude
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		)
WHERE (
		FullName,
		Address1,
		Address2,
		City,
		[State]
		) IN (
		SELECT FullName,
			Address1,
			Address2,
			InputCity,
			Input[State]
		FROM Geocodio
		)
	/* Check for changed value */
	AND Longitude <> (
		SELECT Longitude
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		);

UPDATE Geocoded
SET Zip = (
		SELECT Zip
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		)
WHERE (
		FullName,
		Address1,
		Address2,
		City,
		[State]
		) IN (
		SELECT FullName,
			Address1,
			Address2,
			InputCity,
			Input[State]
		FROM Geocodio
		)
	/* Check for changed value */
	AND Zip <> (
		SELECT Zip
		FROM Geocodio
		WHERE (
				Geocoded.FullName,
				Geocoded.Address1,
				Geocoded.Address2,
				Geocoded.City,
				Geocoded.[State]
				) = (
				Geocodio.FullName,
				Geocodio.Address1,
				Geocodio.Address2,
				Geocodio.City,
				Geocodio.[State]
				)
		);