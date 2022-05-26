USE FlightPub;

SET SQL_SAFE_UPDATES = 0;

UPDATE Flights
SET DepartureTime=DATE_ADD(DepartureTime, INTERVAL 8 YEAR),
	ArrivalTime=DATE_ADD(ArrivalTime, INTERVAL 8 YEAR)
WHERE TRUE;

UPDATE Flights
SET ArrivalTimeStopOver=DATE_ADD(ArrivalTimeStopOver, INTERVAL 8 YEAR),
	DepartureTimeStopOver=DATE_ADD(DepartureTimeStopOver, INTERVAL 8 YEAR)
WHERE ArrivalTimeStopOver IS NOT NULL;

SET SQL_SAFE_UPDATES = 1;