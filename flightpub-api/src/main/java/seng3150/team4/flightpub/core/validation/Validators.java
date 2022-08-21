package seng3150.team4.flightpub.core.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class Validators {

  /**
   * Validates an email address ensuring that it is a valid address
   *
   * @param email the email address that is validated
   * @return A list of error messages
   */
  public static List<String> emailValidator(String email) {
    var regexPattern =
        "^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$";
    var isValid = Pattern.compile(regexPattern).matcher(email).matches();
    var errors = new ArrayList<String>() {};

    if (!isValid) errors.add("The email is not a valid email");

    return errors;
  }

  public static List<String> passwordValidator(String password) {
    // TODO: implement password validation
    if (Pattern.compile("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
        .matcher(password)
        .matches()) return new ArrayList<String>() {};

    return List.of(
        "The password must be 8 characters, contain at least one of each of the following - UPPERCASE character, lowercase character, digit.");
  }

  /**
   * @param obj The object to check if null or empty
   * @return a {@code boolean} representing if the object has passed validation
   */
  public static <T> boolean isNullOrEmpty(T obj) {
    if (obj == null) return true;

    // If the object is a string, check if it is empty i.e. ""
    if (obj instanceof String) return ((String) obj).isEmpty();

    return false;
  }
}
