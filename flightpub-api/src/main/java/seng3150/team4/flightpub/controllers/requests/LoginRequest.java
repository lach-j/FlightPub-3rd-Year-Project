package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@NoArgsConstructor
@Getter
@Setter
public class LoginRequest extends Validatable {
  private String email;
  private String password;

  // Validate request and return any errors
  @Override
  public ValidationResult getErrors() {
    var validationResult = new ValidationResult();

    // Ensure that email was provided
    if (isNullOrEmpty(email)) {
      validationResult.addError(new ValidationError("email").addError(ErrorConstants.REQUIRED));
    }

    // Ensure password was provided
    if (isNullOrEmpty(password)) {
      validationResult.addError(new ValidationError("password").addError(ErrorConstants.REQUIRED));
    }

    return validationResult;
  }
}
