package seng3150.team4.flightpub.core.validation;

/** RuntimeException thrown when a {@code Validatable} object does not pass validation */
public class InvalidObjectException extends RuntimeException {
  private final ValidationResult result; // result of object validation

  public InvalidObjectException(ValidationResult result) {
    super("The object failed validation");
    this.result = result;
  }

  public ValidationResult getResult() {
    return result;
  }
}
