package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.UserRole;

import static seng3150.team4.flightpub.core.validation.Validators.emailValidator;
import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
@NoArgsConstructor
public class UpdateUserRequest extends Validatable {

  private String firstName;
  private String lastName;
  private String email;
  private UserRole role;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (isNullOrEmpty(firstName) && isNullOrEmpty(lastName) && isNullOrEmpty(email)) {
      result.addError(new ValidationError("error").addError("At least one field is required"));
    }

    if (!isNullOrEmpty(email)) {
      result.addError(new ValidationError("email").addErrors(emailValidator(email)));
    }

    return result;
  }
}
