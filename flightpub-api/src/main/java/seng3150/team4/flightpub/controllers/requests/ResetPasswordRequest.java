package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;
import static seng3150.team4.flightpub.core.validation.Validators.passwordValidator;

@Getter
@Setter
@NoArgsConstructor
public class ResetPasswordRequest extends Validatable {
  private String password;
  private String token;

  // Validate request and return any errors
  @Override
  protected ValidationResult getErrors() {
    var results = new ValidationResult();

    // Ensure password was provided and is valid
    var passwordErrors = new ValidationError("password");
    if (isNullOrEmpty(password)) {
      passwordErrors.addError(ErrorConstants.REQUIRED);
    } else {
      passwordErrors.addErrors(passwordValidator(password));
    }
    results.addError(passwordErrors);

    // Ensure token was provided
    if (isNullOrEmpty(token))
      results.addError(new ValidationError("token").addError(ErrorConstants.REQUIRED));

    return results;
  }
}
