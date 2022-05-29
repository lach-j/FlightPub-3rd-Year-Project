package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import seng3150.team4.flightpub.core.validation.ValidationResult;

/**
 * Extends StatusResponse for returning ValidationResults of Validatable objects when object
 * validation does not pass.
 */
@Getter
public class InvalidObjectResponse extends StatusResponse {
  @JsonUnwrapped
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final ValidationResult validationResult;

  public InvalidObjectResponse(ValidationResult validationResult, String message) {
    super(HttpStatus.BAD_REQUEST);
    this.message = message;
    this.validationResult = validationResult;
  }
}
