package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishlistRequest extends Validatable {
  private List<String> destinations;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    var destinationErrors = new ValidationError("destinations");
    if (Validators.isNullOrEmpty(destinations) || destinations.isEmpty())
      destinationErrors.addError(ErrorConstants.REQUIRED);
    else if (destinations.size() > 10)
      destinationErrors.addError("The maximum number of wishlist items is 10");

    result.addError(destinationErrors);
    return result;
  }
}
