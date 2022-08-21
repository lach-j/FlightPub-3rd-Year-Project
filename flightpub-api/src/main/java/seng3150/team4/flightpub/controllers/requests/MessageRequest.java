package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest extends Validatable {
  private String content;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (Validators.isNullOrEmpty(content)) {
      result.addError(new ValidationError("content").addError(ErrorConstants.REQUIRED));
    }

    return result;
  }
}
