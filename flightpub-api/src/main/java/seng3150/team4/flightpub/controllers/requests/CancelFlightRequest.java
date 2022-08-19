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
public class CancelFlightRequest extends Validatable {

    private Boolean cancelled;

    @Override
    protected ValidationResult getErrors() {
        var result = new ValidationResult();

        if (isNullOrEmpty(cancelled))
            result.addError(new ValidationError("cancelled").addError(ErrorConstants.REQUIRED));

        return result;
    }
}
