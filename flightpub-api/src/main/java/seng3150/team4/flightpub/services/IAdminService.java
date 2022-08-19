package seng3150.team4.flightpub.services;

import org.springframework.web.bind.annotation.PathVariable;
import seng3150.team4.flightpub.domain.models.*;

/** Interface to define AdminService methods */
public interface IAdminService {

    Airline SponsorAirline(Airline airline);

    Destination MarkCovid(Destination destination);

    Flight CancelFlight(Flight flight);

    Flight getCanceledFlightById(long id);

    SponsoredAirlines getSponsoredAirlineById(long id);

    CovidDestinations getCovidLocationById(long id);





}
