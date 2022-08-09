package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Airline;
import seng3150.team4.flightpub.domain.models.Destination;
import seng3150.team4.flightpub.domain.models.Flight;

/** Interface to define AdminService methods */
public interface IAdminService {

    Airline SponsorAirline(Airline airline);

    Destination MarkCovid(Destination destination);

    Flight CancelFlight(Flight flight);


}
