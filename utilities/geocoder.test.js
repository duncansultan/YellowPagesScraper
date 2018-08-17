const geocode = require("./geocode");
const Address = require("../models/Address");

// Arrange
const address = new Address(
  "Njeri Wainaina",
  "220 Indian Park DR #APT 904, Murfreesboro, TN 37128"
);

// Act
const result = geocode(address);

// Assert
result != null;
