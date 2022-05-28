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

@NoArgsConstructor
@Getter
@Setter
public class LoginRequest extends Validatable {
  private String email;
  private String password;

  @Override
  public ValidationResult getErrors() {
    var validationResult = new ValidationResult();

    var emailErrors = new ValidationError("email");
    if (isNullOrEmpty(email)) {
      emailErrors.addError(ErrorConstants.REQUIRED);
    }
    validationResult.addError(emailErrors);

    var passwordErrors = new ValidationError("password");
    if (isNullOrEmpty(password)) {
      passwordErrors.addError(ErrorConstants.REQUIRED);
    } else {
      passwordErrors.addErrors(passwordValidator(password));
    }
    validationResult.addError(passwordErrors);

    return validationResult;
  }
}
