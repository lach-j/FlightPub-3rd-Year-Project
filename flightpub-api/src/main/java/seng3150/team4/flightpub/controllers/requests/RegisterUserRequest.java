package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.UserRole;

import static seng3150.team4.flightpub.core.validation.Validators.*;

@Getter
@Setter
@NoArgsConstructor
public class RegisterUserRequest extends Validatable {
  private String email;
  private String password;
  private String firstName;
  private String lastName;
  private UserRole role = UserRole.STANDARD_USER;

  // Validate request and return any errors
  @Override
  protected ValidationResult getErrors() {
    var validationResult = new ValidationResult();

    // Ensure email was provided and is a valid email
    var emailErrors = new ValidationError("email");
    if (isNullOrEmpty(email)) {
      emailErrors.addError(ErrorConstants.REQUIRED);
    } else {
      emailErrors.addErrors(emailValidator(email));
    }
    validationResult.addError(emailErrors);

    // Ensure password was provided and is valid
    var passwordErrors = new ValidationError("password");
    if (isNullOrEmpty(password)) {
      passwordErrors.addError(ErrorConstants.REQUIRED);
    } else {
      passwordErrors.addErrors(passwordValidator(password));
    }
    validationResult.addError(passwordErrors);

    // Ensure firstName was provided
    if (isNullOrEmpty(firstName)) {
      validationResult.addError(new ValidationError("firstName").addError(ErrorConstants.REQUIRED));
    }

    // Ensure firstName was provided
    if (isNullOrEmpty(lastName)) {
      validationResult.addError(new ValidationError("lastName").addError(ErrorConstants.REQUIRED));
    }

    return validationResult;
  }
}
