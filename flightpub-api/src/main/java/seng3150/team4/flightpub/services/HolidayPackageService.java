package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.HolidayPackage;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageRepository;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HolidayPackageService implements IHolidayPackageService {

  private final IHolidayPackageRepository holidayPackageRepository;

  private final IFlightRepository flightRepository;

  @Override
  public HolidayPackage makePackage(HolidayPackage holidayPackage, Set<Long> flightIds) {
    var flights = new HashSet<Flight>();
    flightRepository.findAllById(flightIds).forEach(flights::add);
    holidayPackage.setFlights(flights);
    HolidayPackage savedHolidayPackage = holidayPackageRepository.save(holidayPackage);
    return savedHolidayPackage;
  }

  public List<HolidayPackage> getRecommendedPackages(String departure) {

    return holidayPackageRepository.findByDestination(departure);
  }

  @Override
  public void deletePackage(HolidayPackage holidayPackage) {
    holidayPackageRepository.delete(holidayPackage);
  }

  @Override
  public HolidayPackage getHolidayPackageById(long holidayPackageId) {
    var holidayPackage = holidayPackageRepository.findById(holidayPackageId);
    if (holidayPackage.isEmpty())
      throw new EntityNotFoundException(
          String.format("Booking with id %s not found", holidayPackage));

    return holidayPackage.get();
  }
}
