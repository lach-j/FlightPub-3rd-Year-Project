package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.HolidayPackage;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageRepository;

@Service
@RequiredArgsConstructor
public class HolidayPackageService implements IHolidayPackageService {

    private final IHolidayPackageRepository holidayPackageRepository;

    @Override
    public HolidayPackage makePackage(HolidayPackage holidayPackage) {

        HolidayPackage savedHolidayPackage = holidayPackageRepository.save(holidayPackage);
        return savedHolidayPackage;
    }
    @Override
    public void deletePackage(HolidayPackage holidayPackage) {
        holidayPackageRepository.delete(holidayPackage);
    }
}
