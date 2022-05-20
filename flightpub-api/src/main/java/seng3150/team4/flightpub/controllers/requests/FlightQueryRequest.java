package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.Setter;
import seng3150.team4.flightpub.core.search.FlexiDate;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class FlightQueryRequest extends Validatable {
    private FlexiDate departureDate;
    private String departureCode;
    private String destinationCode;
    private List<String> tickets;
    private Boolean returnFlight;

    private int page;

    public ValidationResult getErrors() {
        var errors = new ValidationResult();

        if (departureDate != null && departureDate.getMaxDateTime().isBefore(LocalDateTime.now())) {
            errors.addError(
                    new ValidationError("fromDate")
                            .addError("Cannot query past flights")
            );
        }

        return errors;
    }
}
