package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.domain.models.Payment;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class HolidayPackageBookingRequest extends Validatable {

  private Long holidayPackageId;

  private Set<Passenger> passengers;

  private Set<Long> flightIds;

  private Payment payment;

  @Override
  protected ValidationResult getErrors() {
    return new ValidationResult();
  }
}
