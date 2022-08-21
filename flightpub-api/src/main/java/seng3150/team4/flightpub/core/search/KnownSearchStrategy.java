package seng3150.team4.flightpub.core.search;

import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.domain.models.CovidDestination;
import seng3150.team4.flightpub.domain.models.Flight;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/** SearchStrategy used for Known Search */
public class KnownSearchStrategy extends SearchStrategy {

  public KnownSearchStrategy(FlightQueryRequest flightQuery) {
    super(flightQuery);
  }

  @Override
  public List<Flight> search() {

    // Create list of predicates to query by
    List<Predicate> predicates = new ArrayList<>();

    // Filter out cancelled flights
    predicates.add(cb.equal(flight.get("cancelled"), flightQuery.isCancelled()));

    // If the departure date is included then only include flights included in the flexible range
    // For exact search this is a required field
    if (flightQuery.getDepartureDate() != null) {
      predicates.add(
          cb.greaterThan(
              flight.get("departureTime"), flightQuery.getDepartureDate().getMinDateTime()));
      predicates.add(
          cb.lessThan(
              flight.get("departureTime"), flightQuery.getDepartureDate().getMaxDateTime()));
    }

    if (flightQuery.getFlightNumber() != null && !flightQuery.getFlightNumber().isEmpty())
      predicates.add(
          cb.like(
              flight.get("flightNumber"), "%" + flightQuery.getFlightNumber().toUpperCase() + "%"));

    // If the departure location is included in the request, add to query
    // For exact search this is a required field
    if (flightQuery.getDepartureCode() != null)
      predicates.add(
          cb.equal(
              flight.get("departureLocation").get("destinationCode"),
              flightQuery.getDepartureCode()));

    // If the destination location is included in the request, add to query
    if (flightQuery.getDestinationCode() != null)
      predicates.add(
          cb.equal(
              flight.get("arrivalLocation").get("destinationCode"),
              flightQuery.getDestinationCode()));

    Subquery<Integer> subQuery = query.subquery(Integer.class);
    Root<CovidDestination> covid = subQuery.from(CovidDestination.class);

    // Subquery here is used to check if the flight destination is covid listed.
    subQuery
        .select(cb.literal(1))
        .where(
            cb.equal(
                covid.get("destination").get("destinationCode"),
                flight.get("arrivalLocation").get("destinationCode")),
            cb.greaterThan(covid.get("covidEndDate"), LocalDate.now(ZoneOffset.UTC)));

    // Filter out flights with covid destinations
    predicates.add(cb.not(cb.exists(subQuery)));
    // TODO: add WHERE clauses for ticket type/quantity

    // Add where clause where all predicates are required (AND operation)
    query.where(cb.and(predicates.toArray(new Predicate[0])));

    // return list of flights matching query
    return getResults();
  }
}
