package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.HolidayPackage;
import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class HolidayPackageBookingRequest extends Validatable {

    private long userId;

    private Set<Long> flightIds;

    private Set<Passenger> passengers;

    private HolidayPackage holidayPackage;

    @Override
    protected ValidationResult getErrors() {
        return new ValidationResult();
    }
}
