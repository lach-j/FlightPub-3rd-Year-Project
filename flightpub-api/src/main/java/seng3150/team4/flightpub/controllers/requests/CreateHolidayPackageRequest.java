package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.Destination;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
public class CreateHolidayPackageRequest extends Validatable {

    private Boolean isPopular;
    private String  imageURL;
    private String  packageName;
    private String  packageDescription;
    private String  packageTagline;
    private Integer packageNights;
    private String  location;
    private Integer price;
    private String  arrivalLocation;


    @Override
    protected ValidationResult getErrors() {
        return new ValidationResult();
    }
}