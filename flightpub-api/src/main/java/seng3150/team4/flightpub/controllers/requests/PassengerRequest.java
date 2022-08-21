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

@Getter
@Setter
@NoArgsConstructor
public class PassengerRequest extends Validatable {
  private String email;
  private String password;
  private String firstName;
  private String lastName;

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
