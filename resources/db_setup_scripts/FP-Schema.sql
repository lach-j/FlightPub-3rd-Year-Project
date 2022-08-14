DROP SCHEMA FlightPub;
CREATE SCHEMA FlightPub;
USE FlightPub;

CREATE TABLE `Country` (
  `countryCode2` char(2) NOT NULL,
  `countryCode3` char(3) NOT NULL,
  `countryName` varchar(80) NOT NULL DEFAULT '',
  `alternateName1` varchar(80) NOT NULL DEFAULT '',
  `alternateName2` varchar(80) NOT NULL DEFAULT '',
  `motherCountryCode3` char(3) NOT NULL DEFAULT '',
  `motherCountryComment` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`countryCode3`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Airlines` (
  `AirlineCode` char(2) NOT NULL,
  `AirlineName` varchar(30) NOT NULL,
  `CountryCode3` char(3) NOT NULL,
  PRIMARY KEY (`AirlineCode`),
  KEY `AirlinesCountryCode3_FK` (`CountryCode3`),
  CONSTRAINT `AirlinesCountryCode3_FK` FOREIGN KEY (`CountryCode3`) REFERENCES `Country` (`countryCode3`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `PlaneType` (
  `PlaneCode` varchar(20) NOT NULL,
  `Details` varchar(50) NOT NULL,
  `NumFirstClass` int(11) NOT NULL,
  `NumBusiness` int(11) NOT NULL,
  `NumPremiumEconomy` int(11) NOT NULL,
  `Economy` int(11) NOT NULL,
  PRIMARY KEY (`PlaneCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Destinations` (
  `DestinationCode` char(3) NOT NULL,
  `Airport` varchar(30) NOT NULL,
  `CountryCode3` char(3) NOT NULL,
  PRIMARY KEY (`DestinationCode`),
  KEY `DestinationCountryCode_FK` (`CountryCode3`),
  CONSTRAINT `DestinationCountryCode_FK` FOREIGN KEY (`CountryCode3`) REFERENCES `Country` (`countryCode3`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `TicketClass` (
  `ClassCode` char(3) NOT NULL,
  `Details` varchar(20) NOT NULL,
  PRIMARY KEY (`ClassCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Availability` (
  `FlightId` BIGINT NOT NULL,
  `ClassCode` char(3) NOT NULL,
  `NumberAvailableSeatsLeg1` int(11) NOT NULL,
  `NumberAvailableSeatsLeg2` int(11) DEFAULT NULL,
  PRIMARY KEY (`FlightId`,`ClassCode`),
  KEY `AvailabilityClassCode_FK` (`ClassCode`),
  CONSTRAINT `AvailabilityClassCode_FK` FOREIGN KEY (`ClassCode`) REFERENCES `TicketClass` (`ClassCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Distances` (
  `DestinationCode1` char(3) NOT NULL,
  `DestinationCode2` char(3) NOT NULL,
  `DistancesInKms` int(11) NOT NULL,
  PRIMARY KEY (`DestinationCode1`,`DestinationCode2`),
  KEY `DestinationCode2_FK` (`DestinationCode2`),
  CONSTRAINT `DestinationCode2_FK` FOREIGN KEY (`DestinationCode2`) REFERENCES `Destinations` (`DestinationCode`),
  CONSTRAINT `DestinationCode1_FK` FOREIGN KEY (`DestinationCode1`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Price` (
  `FlightId` BIGINT NOT NULL,
  `ClassCode` char(3) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `PriceLeg1` decimal(10,2) DEFAULT NULL,
  `PriceLeg2` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`FlightId`,`ClassCode`),
  KEY `PriceClassCode_FK` (`ClassCode`),
  KEY `PriceFlightId_FK` (`FlightId`),
  CONSTRAINT `PriceClassCode_FK` FOREIGN KEY (`ClassCode`) REFERENCES `TicketClass` (`ClassCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Flights` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `AirlineCode` char(2) NOT NULL,
  `FlightNumber` varchar(6) NOT NULL,
  `DepartureCode` char(3) NOT NULL,
  `StopOverCode` char(3) DEFAULT NULL,
  `DestinationCode` char(3) NOT NULL,
  `DepartureTime` datetime NOT NULL,
  `ArrivalTimeStopOver` datetime DEFAULT NULL,
  `DepartureTimeStopOver` datetime DEFAULT NULL,
  `ArrivalTime` datetime NOT NULL,
  `PlaneCode` varchar(20) NOT NULL,
  `Duration` int(11) NOT NULL,
  `DurationSecondLeg` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FlightsDepartureCode_FK` (`DepartureCode`),
  KEY `FlightsStopOverCode_FK` (`StopOverCode`),
  KEY `FlightsDestinationCode_FK` (`DestinationCode`),
  KEY `FlightsPlaneCode_FK` (`PlaneCode`),
  CONSTRAINT `FlightsPlaneCode_FK` FOREIGN KEY (`PlaneCode`) REFERENCES `PlaneType` (`PlaneCode`),
  CONSTRAINT `FlightsAirlineCode_FK` FOREIGN KEY (`AirlineCode`) REFERENCES `Airlines` (`AirlineCode`),
  CONSTRAINT `FlightsDepartureCode_FK` FOREIGN KEY (`DepartureCode`) REFERENCES `Destinations` (`DestinationCode`),
  CONSTRAINT `FlightsDestinationCode_FK` FOREIGN KEY (`DestinationCode`) REFERENCES `Destinations` (`DestinationCode`),
  CONSTRAINT `FlightsStopOverCode_FK` FOREIGN KEY (`StopOverCode`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CovidDestinations` (
  `CovidCode` char(3) NOT NULL,
  `CovidStartDate` datetime Default(NULL),
  `CovidEndDate` datetime Default(NULL),
  `LocationCode` char(3) NOT NULL,
  PRIMARY KEY (`CovidCode`),
  KEY `CovidDestinationCode_FK` (`LocationCode`),
  CONSTRAINT `CovidDestinationCode_FK` FOREIGN KEY (`LocationCode`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `SponsoredAirlines` (
  `SponsoredCode` char(2) NOT NULL,
  `SponsoredStartDate` datetime Default(NULL),
  `SponsoredEndDate` datetime Default(NULL),
  `AirCode` char(2) NOT NULL,
  PRIMARY KEY (`SponsoredCode`),
  KEY `SponsoredAirlinesCode_FK` (`AirCode`),
  CONSTRAINT `SponsoredAirlinesCode_FK` FOREIGN KEY (`AirCode`) REFERENCES `Airlines` (`AirlineCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CanceledFlights` (
  `Id` BIGINT NOT NULL,
  `FlightId` BIGINT NOT NULL,
  `Canceled` Boolean NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FlightId_FK` (`FlightId`),
  CONSTRAINT `FlightId_FK` FOREIGN KEY (`FlightId`) REFERENCES `Flights` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;