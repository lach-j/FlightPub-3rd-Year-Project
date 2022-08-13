package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageRepository;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HolidayPackageBookingService implements IHolidayPackageBookingService {

    private final IBookingRepository bookingRepository;
    private final IHolidayPackageRepository holidayPackageRepository;
    private final IHolidayPackageBookingRepository holidayPackageBookingRepository;


    @Override
    public HolidayPackageBooking makeHolidayPackageBooking(HolidayPackageBooking holidayPackageBooking, Long bookingId) {
        var flightBooking = new Booking();
        bookingRepository.findById(bookingId);
        holidayPackageBooking.setFlightBooking(flightBooking);
        HolidayPackageBooking saveHolidayPackageBooking = holidayPackageBookingRepository.save(holidayPackageBooking);
        return saveHolidayPackageBooking;
    }

    @Override
    public void deleteHolidayPackageBooking(HolidayPackageBooking holidayPackageBooking) {
        holidayPackageBookingRepository.delete(holidayPackageBooking);
    }
}