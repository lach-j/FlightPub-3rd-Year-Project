package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SessionRequest extends Validatable {

  private Set<Long> userIds;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (userIds == null || userIds.isEmpty())
      result.addError(new ValidationError("userIds").addError("At least one Id is required"));

    return result;
  }
}
