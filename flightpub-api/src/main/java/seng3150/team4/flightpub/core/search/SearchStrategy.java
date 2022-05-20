package seng3150.team4.flightpub.core.search;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.domain.models.Flight;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import java.util.List;

import static seng3150.team4.flightpub.utility.Utilities.getValueOrDefault;

public abstract class SearchStrategy {

    private EntityManager em;

    protected CriteriaBuilder cb;
    protected CriteriaQuery<Flight> query;
    protected Root<Flight> flight;

    protected FlightQueryRequest flightQuery;

    public SearchStrategy(FlightQueryRequest flightQuery) {
        this.flightQuery = flightQuery;
    }

    public abstract List<Flight> search();

    public SearchStrategy setEntityManager(EntityManager em) {
        this.em = em;
        cb = em.getCriteriaBuilder();
        query = cb.createQuery(Flight.class);
        flight = query.from(Flight.class);
        query.select(flight);
        return this;
    }

    protected List<Flight> getResults() {
        query.orderBy(cb.desc(flight.get("departureTime")));
        TypedQuery<Flight> results = em.createQuery(query);
        paginate(results);
        return results.getResultList();
    }

    private void paginate(TypedQuery<Flight> results) {
        int pageNum = getValueOrDefault(flightQuery.getPage(), 0);
        results.setFirstResult(pageNum);
        results.setMaxResults(1000);
    }
}
