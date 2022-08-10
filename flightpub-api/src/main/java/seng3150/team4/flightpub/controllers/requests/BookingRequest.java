package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class BookingRequest extends Validatable {

  private Set<Long> flightIds;

  private Set<Passenger> passengers;

  @Override
  protected ValidationResult getErrors() {
    return new ValidationResult();
  }
}
