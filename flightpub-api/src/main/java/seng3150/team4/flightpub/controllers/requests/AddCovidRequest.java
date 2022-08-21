package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDate;
import java.time.ZoneOffset;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
@NoArgsConstructor
public class AddCovidRequest extends Validatable {

  private String locationCode;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate restrictionDuration;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (isNullOrEmpty(locationCode))
      result.addError(new ValidationError("locationCode").addError(ErrorConstants.REQUIRED));

    if (isNullOrEmpty(restrictionDuration))
      result.addError(new ValidationError("restrictionDuration").addError(ErrorConstants.REQUIRED));
    else if (restrictionDuration.isBefore(LocalDate.now(ZoneOffset.UTC)))
      result.addError(
          new ValidationError("restrictionDuration").addError("Must be a future date."));

    return result;
  }
}
