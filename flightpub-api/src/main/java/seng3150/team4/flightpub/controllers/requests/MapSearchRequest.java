package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationResult;

@Getter
@Setter
public class MapSearchRequest extends Validatable {
    private String departureCode;

    @Override
    protected ValidationResult getErrors() {
        return new ValidationResult();
    }
}
