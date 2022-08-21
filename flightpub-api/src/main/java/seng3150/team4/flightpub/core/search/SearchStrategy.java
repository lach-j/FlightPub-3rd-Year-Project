package seng3150.team4.flightpub.core.search;

import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.domain.models.Flight;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

import static seng3150.team4.flightpub.utility.Utilities.getValueOrDefault;

public abstract class SearchStrategy {

  // Using criteria query for complex queries
  protected EntityManager em;
  protected CriteriaBuilder cb;
  protected CriteriaQuery<Flight> query;
  protected Root<Flight> flight;

  protected FlightQueryRequest flightQuery;

  public SearchStrategy(FlightQueryRequest flightQuery) {
    this.flightQuery = flightQuery;
  }

  public abstract List<Flight> search();

  // Pass through persistence context to query DB
  public SearchStrategy setEntityManager(EntityManager em) {
    this.em = em;
    cb = em.getCriteriaBuilder();
    query = cb.createQuery(Flight.class);
    flight = query.from(Flight.class);
    query.select(flight);
    return this;
  }

  // Execute query and return results ordered by departure time
  protected List<Flight> getResults() {
    var sortColumn = flight.get("departureTime");

    try {
      sortColumn = flight.get(flightQuery.getOrderBy());
    } catch (IllegalArgumentException ex) {
    }

    if (flightQuery.getDescending() != null)
      query.orderBy(flightQuery.getDescending() ? cb.desc(sortColumn) : cb.asc(sortColumn));

    TypedQuery<Flight> results = em.createQuery(query);
    paginate(results);
    return results.getResultList();
  }

  // Get 100 results per page
  private void paginate(TypedQuery<Flight> results) {
    int pageNum = getValueOrDefault(flightQuery.getPage(), 0);
    results.setFirstResult(pageNum);
    results.setMaxResults(100);
  }
}
