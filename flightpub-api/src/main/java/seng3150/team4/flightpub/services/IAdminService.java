package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.*;

/** Interface to define AdminService methods */
public interface IAdminService {

  Airline SponsorAirline(Airline airline);

  Destination MarkCovid(Destination destination);

  Flight CancelFlight(Flight flight);

  Flight getCanceledFlightById(long id);

  SponsoredAirline getSponsoredAirlineById(long id);

  CovidDestination getCovidLocationById(long id);
}
