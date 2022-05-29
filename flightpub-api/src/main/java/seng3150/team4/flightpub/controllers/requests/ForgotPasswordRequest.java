package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import static seng3150.team4.flightpub.core.validation.Validators.emailValidator;
import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@NoArgsConstructor
@Getter
@Setter
public class ForgotPasswordRequest extends Validatable {
  private String email;

  // Validate request and return any errors
  @Override
  public ValidationResult getErrors() {
    var validationResult = new ValidationResult();

    // Ensure that email was provided and was a valid email
    var emailErrors = new ValidationError("email");
    if (isNullOrEmpty(email)) {
      emailErrors.addError(ErrorConstants.REQUIRED);
    } else {
      emailErrors.addErrors(emailValidator(email));
    }
    validationResult.addError(emailErrors);

    return validationResult;
  }
}
