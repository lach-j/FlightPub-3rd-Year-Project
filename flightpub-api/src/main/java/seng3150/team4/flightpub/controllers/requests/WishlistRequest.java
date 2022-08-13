package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.util.List;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishlistRequest extends Validatable {
  private List<String> destinations;
  private String departureCode;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (isNullOrEmpty(departureCode))
      result.addError(new ValidationError("departureCode").addError(ErrorConstants.REQUIRED));

    var destinationErrors = new ValidationError("destinations");
    if (isNullOrEmpty(destinations) || destinations.isEmpty())
      destinationErrors.addError(ErrorConstants.REQUIRED);
    else if (destinations.size() > 10)
      destinationErrors.addError("The maximum number of wishlist items is 10");

    result.addError(destinationErrors);
    return result;
  }
}
