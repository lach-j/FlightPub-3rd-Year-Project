package seng3150.team4.flightpub.domain.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class FlightId implements Serializable {

    private String airlineCode;
    private String flightNumber;
    private LocalDateTime departureTime;

    public FlightId() {
    }

    public FlightId(String airlineCode, String flightNumber, LocalDateTime departureTime) {
        this.airlineCode = airlineCode;
        this.flightNumber = flightNumber;
        this.departureTime = departureTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FlightId flightId = (FlightId) o;
        return airlineCode.equals(flightId.airlineCode) &&
                flightNumber.equals(flightId.flightNumber) &&
                departureTime.equals(flightId.departureTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(airlineCode, flightNumber, departureTime);
    }

    public static FlightId fromFlight(Flight flight) {
        return new FlightId(flight.getAirlineCode(), flight.getFlightNumber(), flight.getDepartureTime());
    }
}
