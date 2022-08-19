package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.repositories.*;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final IFlightRepository flightRepository;
    private final IDestinationRepository destinationRepository;
    private final IAirlineRepository airlineRepository;
    private final ICanceledRepository canceledRepository;
    private final ICovidRepository covidRepository;
    private final ISponsorRepository sponsorRepository;

    Airline SponsorAirline(Airline airline) {
        return airlineRepository.save(airline);
    }

    Destination MarkCovid(Destination destination) {
        return destinationRepository.save(destination);
    }

    Flight CancelFlight(Flight flight) {
        return flightRepository.save(flight);
    }


    public CanceledFlights getCanceledFlightById(long id) {
        // If the user does not exist that throw an exception
        var canceledFlight = canceledRepository.findById(id);
        if (canceledFlight.isEmpty())
            throw new EntityNotFoundException(String.format("Canceled Flight with id %s was not found", id));
        // Otherwise, return the user
        return canceledFlight.get();
    }


    public SponsoredAirlines getSponsoredAirlineById(long id) {
        // If the user does not exist that throw an exception
        var sponsoredAirlines = sponsorRepository.findById(id);
        if (sponsoredAirlines.isEmpty())
            throw new EntityNotFoundException(String.format("Sponsored airline with id %s was not found", id));
        // Otherwise, return the user
        return sponsoredAirlines.get();
    }


    public CovidDestination getCovidLocationById(long id) {
        // If the user does not exist that throw an exception
        var covidDestination = covidRepository.findById(id);
        if (covidDestination.isEmpty())
            throw new EntityNotFoundException(String.format("Covid Destination with id %s was not found", id));
        // Otherwise, return the user
        return covidDestination.get();
    }
}
