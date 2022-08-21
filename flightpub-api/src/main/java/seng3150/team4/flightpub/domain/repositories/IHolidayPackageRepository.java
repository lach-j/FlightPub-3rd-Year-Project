package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.HolidayPackage;

import java.util.List;

public interface IHolidayPackageRepository extends JpaRepository<HolidayPackage, Long> {

  @Query("SELECT h FROM HolidayPackage h WHERE h.arrivalLocation = ?1")
  List<HolidayPackage> findByDestination(String destination);
}
