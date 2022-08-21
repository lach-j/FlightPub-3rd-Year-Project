DROP SCHEMA IF EXISTS FlightPub;

CREATE SCHEMA FlightPub;

USE FlightPub;

CREATE TABLE `Country` (
  `CountryCode2` char(2) NOT NULL,
  `CountryCode3` char(3) NOT NULL,
  `CountryName` varchar(80) NOT NULL DEFAULT '',
  `AlternateName1` varchar(80) NOT NULL DEFAULT '',
  `AlternateName2` varchar(80) NOT NULL DEFAULT '',
  `MotherCountryCode3` char(3) NOT NULL DEFAULT '',
  `MotherCountryComment` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`CountryCode3`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Airlines` (
  `AirlineCode` char(2) NOT NULL,
  `AirlineName` varchar(30) NOT NULL,
  `CountryCode3` char(3) NOT NULL,
  PRIMARY KEY (`AirlineCode`),
  KEY `AirlinesCountryCode3_FK` (`CountryCode3`),
  CONSTRAINT `AirlinesCountryCode3_FK` FOREIGN KEY (`CountryCode3`) REFERENCES `Country` (`CountryCode3`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `PlaneType` (
  `PlaneCode` varchar(20) NOT NULL,
  `Details` varchar(50) NOT NULL,
  `NumFirstClass` int NOT NULL,
  `NumBusiness` int NOT NULL,
  `NumPremiumEconomy` int NOT NULL,
  `Economy` int NOT NULL,
  PRIMARY KEY (`PlaneCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Destinations` (
  `DestinationCode` char(3) NOT NULL,
  `Airport` varchar(30) NOT NULL,
  `CountryCode3` char(3) NOT NULL,
  PRIMARY KEY (`DestinationCode`),
  KEY `DestinationCountryCode_FK` (`CountryCode3`),
  CONSTRAINT `DestinationCountryCode_FK` FOREIGN KEY (`CountryCode3`) REFERENCES `Country` (`CountryCode3`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TicketClass` (
  `ClassCode` char(3) NOT NULL,
  `Details` varchar(20) NOT NULL,
  PRIMARY KEY (`ClassCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Availability` (
  `FlightId` BIGINT NOT NULL,
  `ClassCode` char(3) NOT NULL,
  `NumberAvailableSeatsLeg1` int NOT NULL,
  `NumberAvailableSeatsLeg2` int DEFAULT NULL,
  PRIMARY KEY (`FlightId`, `ClassCode`),
  KEY `AvailabilityClassCode_FK` (`ClassCode`),
  CONSTRAINT `AvailabilityClassCode_FK` FOREIGN KEY (`ClassCode`) REFERENCES `TicketClass` (`ClassCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Distances` (
  `DestinationCode1` char(3) NOT NULL,
  `DestinationCode2` char(3) NOT NULL,
  `DistancesInKms` int NOT NULL,
  PRIMARY KEY (`DestinationCode1`, `DestinationCode2`),
  KEY `DestinationCode2_FK` (`DestinationCode2`),
  CONSTRAINT `DestinationCode2_FK` FOREIGN KEY (`DestinationCode2`) REFERENCES `Destinations` (`DestinationCode`),
  CONSTRAINT `DestinationCode1_FK` FOREIGN KEY (`DestinationCode1`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Price` (
  `FlightId` BIGINT NOT NULL,
  `ClassCode` char(3) NOT NULL,
  `Price` decimal(10, 2) NOT NULL,
  `PriceLeg1` decimal(10, 2) DEFAULT NULL,
  `PriceLeg2` decimal(10, 2) DEFAULT NULL,
  PRIMARY KEY (`FlightId`, `ClassCode`),
  KEY `PriceClassCode_FK` (`ClassCode`),
  KEY `PriceFlightId_FK` (`FlightId`),
  CONSTRAINT `PriceClassCode_FK` FOREIGN KEY (`ClassCode`) REFERENCES `TicketClass` (`ClassCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

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
  `Duration` int NOT NULL,
  `DurationSecondLeg` int DEFAULT NULL,
  `Cancelled` BIT DEFAULT 0,
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
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `CovidStartDate` datetime NOT NULL,
  `CovidEndDate` datetime NOT NULL,
  `LocationCode` char(3) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `CovidDestinationCode_FK` (`LocationCode`),
  CONSTRAINT `CovidDestinationCode_FK` FOREIGN KEY (`LocationCode`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `SponsoredAirlines` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `SponsoredStartDate` datetime NOT NULL,
  `SponsoredEndDate` datetime NOT NULL,
  `AirlineCode` char(2) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `SponsoredAirlinesCode_FK` (`AirlineCode`),
  CONSTRAINT `SponsoredAirlinesCode_FK` FOREIGN KEY (`AirlineCode`) REFERENCES `Airlines` (`AirlineCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CanceledFlights` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `FlightId` BIGINT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FlightId_FK` (`FlightId`),
  CONSTRAINT `FlightId_FK` FOREIGN KEY (`FlightId`) REFERENCES `Flights` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `FPUser` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Email` VARCHAR(255) UNIQUE,
  `FirstName` VARCHAR(255),
  `LastName` VARCHAR(255),
  `Password` VARCHAR(255),
  `Role` INT,
  `Deleted` BIT DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Wishlist` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `DateCreated` DATETIME NOT NULL,
  `UserId` BIGINT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId_FK` (`UserId`),
  CONSTRAINT `UserId_FK` FOREIGN KEY (`UserId`) REFERENCES `FPUser` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `WishlistItem` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `WishlistId` BIGINT NOT NULL,
  `DestinationCode` CHAR(3) NOT NULL,
  `ItemRank` INT,
  PRIMARY KEY (`Id`),
  KEY `WishlistId_FK` (`WishlistId`),
  KEY `DestinationCode_FK` (`DestinationCode`),
  CONSTRAINT `WishlistId_FK` FOREIGN KEY (`WishlistId`) REFERENCES `Wishlist` (`Id`),
  CONSTRAINT `DestinationCode_FK` FOREIGN KEY (`DestinationCode`) REFERENCES `Destinations` (`DestinationCode`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `MessagingSession` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Status` INT NOT NULL DEFAULT 0,
  `WishlistId` BIGINT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `MS_WishlistId_FK` (`WishlistId`),
  CONSTRAINT `MS_WishlistId_FK` FOREIGN KEY (`WishlistId`) REFERENCES `Wishlist` (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `MessagingSession_FPUser` (
  `SessionId` BIGINT NOT NULL,
  `UserId` BIGINT NOT NULL,
  PRIMARY KEY (`SessionId`, `UserId`),
  KEY `MSFP_SessionId_FK` (`SessionId`),
  KEY `MSFP_UserId_FK` (`UserId`),
  CONSTRAINT `MSFP_UserId_FK` FOREIGN KEY (`UserId`) REFERENCES `FPUser` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `MSFP_SessionId_FK` FOREIGN KEY (`SessionId`) REFERENCES `MessagingSession` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Message` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `SessionId` BIGINT NOT NULL,
  `DateSent` DATETIME NOT NULL,
  `Content` VARCHAR(255),
  `UserId` BIGINT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `M_SessionId_FK` (`SessionId`),
  KEY `M_UserId_FK` (`UserId`),
  CONSTRAINT `M_UserId_FK` FOREIGN KEY (`UserId`) REFERENCES `FPUser` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `M_SessionId_FK` FOREIGN KEY (`SessionId`) REFERENCES `MessagingSession` (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Payment` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Type` INT NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Payment_DirectDebit` (
  `PaymentId` BIGINT NOT NULL,
  `BSB` VARCHAR(255) NOT NULL,
  `AccountName` VARCHAR(255) NOT NULL,
  `AccountNumber` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`PaymentId`),
  KEY `PaymentId_DD_FK` (`PaymentId`),
  CONSTRAINT `PaymentId_DD_FK` FOREIGN KEY (`PaymentId`) REFERENCES `Payment` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Payment_Card` (
  `PaymentId` BIGINT NOT NULL,
  `CardNumber` VARCHAR(255) NOT NULL,
  `ExpiryDate` VARCHAR(255) NOT NULL,
  `Cardholder` VARCHAR(255) NOT NULL,
  `CCV` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`PaymentId`),
  KEY `PaymentId_C_FK` (`PaymentId`),
  CONSTRAINT `PaymentId_C_FK` FOREIGN KEY (`PaymentId`) REFERENCES `Payment` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `Payment_PayPal` (
  `PaymentId` BIGINT NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`PaymentId`),
  KEY `PaymentId_PP_FK` (`PaymentId`),
  CONSTRAINT `PaymentId_PP_FK` FOREIGN KEY (`PaymentId`) REFERENCES `Payment` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `SavedPayment` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `UserId` BIGINT NOT NULL,
  `Nickname` VARCHAR(255) NOT NULL,
  `PaymentId` BIGINT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `SP_UserId_FK` (`UserId`),
  KEY `SP_PaymentId_FK` (`PaymentId`),
  CONSTRAINT `SP_UserId_FK` FOREIGN KEY (`UserId`) REFERENCES `FPUser` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `SP_PaymentId_FK` FOREIGN KEY (`PaymentId`) REFERENCES `Payment` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
