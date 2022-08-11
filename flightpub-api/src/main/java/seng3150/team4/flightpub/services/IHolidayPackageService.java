package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.HolidayPackage;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IHolidayPackageService {
    HolidayPackage makePackage(HolidayPackage holidayPackage);

    void deletePackage(HolidayPackage holidayPackage);

/*    HolidayPackage editPackage(long id, HolidayPackage holidayPackage);


    HolidayPackage getHolidayPackageById(long packageId);*/

}
