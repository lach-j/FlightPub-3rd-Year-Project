package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import seng3150.team4.flightpub.core.email.ResetPasswordTemplate;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.repositories.IAirlineRepository;
import seng3150.team4.flightpub.domain.repositories.IDestinationRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.domain.repositories.IResetTokenRepository;
import seng3150.team4.flightpub.utility.PasswordHash;
import seng3150.team4.flightpub.utility.TokenGenerator;

import javax.persistence.EntityNotFoundException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;

import static seng3150.team4.flightpub.utility.TimeFunctions.minutesFromNow;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final IFlightRepository flightRepository;
    private final IDestinationRepository destinationRepository;
    private final IAirlineRepository airlineRepository;

    Airline SponsorAirline(Airline airline) {
        return airlineRepository.save(airline);
    }

    Destination MarkCovid(Destination destination) {
        return destinationRepository.save(destination);
    }

    Flight CancelFlight(Flight flight) {
        return flightRepository.save(flight);
    }
}
