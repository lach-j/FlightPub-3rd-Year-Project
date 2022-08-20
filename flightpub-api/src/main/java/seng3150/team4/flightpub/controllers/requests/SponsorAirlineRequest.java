package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDate;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SponsorAirlineRequest extends Validatable {

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate startDate;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate endDate;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (isNullOrEmpty(startDate))
      result.addError(new ValidationError("startDate").addError(ErrorConstants.REQUIRED));
    if (isNullOrEmpty(endDate))
      result.addError(new ValidationError("endDate").addError(ErrorConstants.REQUIRED));

    if (!(isNullOrEmpty(startDate) && isNullOrEmpty(endDate)))
      if (endDate.isBefore(startDate))
        result.addError(new ValidationError("endDate").addError("Date must be after startDate"));

    return result;
  }
}
