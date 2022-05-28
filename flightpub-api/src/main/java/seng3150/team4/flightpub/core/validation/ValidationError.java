package seng3150.team4.flightpub.core.validation;

import java.util.ArrayList;
import java.util.List;

public class ValidationError {

  private final String fieldName;
  private final List<String> errors = new ArrayList<>();

  public ValidationError(String fieldName) {
    this.fieldName = fieldName;
  }

  public ValidationError addError(String error, Object... params) {
    var err = String.format(error, params);
    errors.add(err);
    return this;
  }

  public ValidationError addErrors(List<String> results) {
    errors.addAll(results);
    return this;
  }

  public List<String> getErrors() {
    return errors;
  }

  public String getFieldName() {
    return fieldName;
  }
}
