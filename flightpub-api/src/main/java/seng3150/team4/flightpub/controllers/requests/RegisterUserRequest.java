package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import static seng3150.team4.flightpub.core.validation.Validators.*;

@Getter
@Setter
@NoArgsConstructor
public class RegisterUserRequest extends Validatable {
    private String email;
    private String password;
    private String firstName;
    private String lastName;

    @Override
    protected ValidationResult getErrors() {
        var validationResult = new ValidationResult();

        var emailErrors = new ValidationError("email");
        if (isNullOrEmpty(email)) {
            emailErrors.addError(ErrorConstants.REQUIRED);
        } else {
            emailErrors.addErrors(emailValidator(email));
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
