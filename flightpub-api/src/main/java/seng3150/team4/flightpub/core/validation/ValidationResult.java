package seng3150.team4.flightpub.core.validation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidationResult {
  private final Map<String, List<String>> errors = new HashMap<>();

  public ValidationResult() {}

  public ValidationResult addError(ValidationError error) {
    if (!error.getErrors().isEmpty()) errors.put(error.getFieldName(), error.getErrors());
    return this;
  }

  public Map<String, List<String>> getErrors() {
    return errors;
  }
}
