package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.Setter;
import seng3150.team4.flightpub.core.search.FlexiDate;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

/** Request for flight search */
@Getter
@Setter
public class FlightQueryRequest extends Validatable {
  private String flightNumber;
  private FlexiDate departureDate;
  private String departureCode;
  private String destinationCode;
  private Map<String, Integer> tickets;
  private Boolean returnFlight;
  private boolean cancelled = false;
  private String orderBy;
  private Boolean descending;

  private int page;

  // Validate request and return any errors
  @Override
  public ValidationResult getErrors() {
    var errors = new ValidationResult();

    var departureDateErrors = new ValidationError("departureDate");
    if (!isNullOrEmpty(departureDate)) {
      // Ensure that query dates are in the future
      if (departureDate.getMaxDateTime().isBefore(LocalDateTime.now(ZoneOffset.UTC)))
        departureDateErrors.addError("Cannot query past flights");

      // Ensure that the flex value is less than 7
      if (departureDate.getFlex() < 0 || departureDate.getFlex() > 7)
        departureDateErrors.addError("\"flex\" field must be between 0 and 7");
    }
    errors.addError(departureDateErrors);

    return errors;
  }
}
