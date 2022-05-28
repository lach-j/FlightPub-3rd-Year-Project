package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.Setter;
import seng3150.team4.flightpub.core.search.FlexiDate;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDateTime;
import java.util.Map;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
public class FlightQueryRequest extends Validatable {
  private FlexiDate departureDate;
  private String departureCode;
  private String destinationCode;

  private Map<String, Integer> tickets;
  private Boolean returnFlight;

  private int page;

  public ValidationResult getErrors() {
    var errors = new ValidationResult();

    var departureDateErrors = new ValidationError("departureDate");
    if (!isNullOrEmpty(departureDate)) {
      if (departureDate.getMaxDateTime().isBefore(LocalDateTime.now()))
        departureDateErrors.addError("Cannot query past flights");
      if (departureDate.getFlex() < 0 || departureDate.getFlex() > 7)
        departureDateErrors.addError("\"flex\" field must be between 0 and 7");
    }
    errors.addError(departureDateErrors);

    return errors;
  }
}
