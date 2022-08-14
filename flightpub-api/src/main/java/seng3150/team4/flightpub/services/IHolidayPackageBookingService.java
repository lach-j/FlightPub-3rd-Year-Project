package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.HolidayPackage;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IHolidayPackageBookingService {
    HolidayPackageBooking makeHolidayPackageBooking(HolidayPackageBooking booking);

    void deleteHolidayPackageBooking(HolidayPackageBooking booking);
}
