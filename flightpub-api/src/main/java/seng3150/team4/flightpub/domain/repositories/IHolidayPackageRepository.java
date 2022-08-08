package seng3150.team4.flightpub.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import seng3150.team4.flightpub.domain.models.HolidayPackage;

import java.util.List;

public interface IHolidayPackageRepository extends JpaRepository<HolidayPackage, Long> {
}
