package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
public class ResetPasswordInternalRequest extends Validatable {
    private String password;

    @Override
    protected ValidationResult getErrors() {
        var result = new ValidationResult();

        if (isNullOrEmpty(password)) {
            result.addError(new ValidationError("password").addError(ErrorConstants.REQUIRED));
        }
        return result;
    }
}
