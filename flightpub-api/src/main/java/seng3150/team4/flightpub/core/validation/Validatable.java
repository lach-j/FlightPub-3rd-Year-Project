package seng3150.team4.flightpub.core.validation;

/** Abstract class that can be extended to implement request validation */
public abstract class Validatable {
  protected abstract ValidationResult getErrors();

  /**
   * Used on {@code Validatable} objects to resolve if validation has failed
   *
   * @throws InvalidObjectException
   */
  public void validate() throws InvalidObjectException {
    var err = getErrors();

    // Check if the validation result contains no errors
    if (err.getErrors().values().stream().allMatch(e -> err.getErrors().isEmpty())) return;

    // Otherwise throw exception
    throw new InvalidObjectException(err);
  }
}
