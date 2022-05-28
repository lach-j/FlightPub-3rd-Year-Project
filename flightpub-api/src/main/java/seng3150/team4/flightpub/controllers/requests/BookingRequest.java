package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDateTime;
import java.util.Set;

import static seng3150.team4.flightpub.core.validation.Validators.*;

@Getter
@Setter
@NoArgsConstructor
public class BookingRequest extends Validatable {

    private long userId;

    private Set<Long> flightIds;

    private LocalDateTime dateBooked;

    @Override
    protected ValidationResult getErrors() {
        return new ValidationResult();
    }

}
