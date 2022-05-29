package seng3150.team4.flightpub.utility;

/** Utility class for misc utility methods */
public class Utilities {

  // If the provided value is null, return a default value instead
  public static <T> T getValueOrDefault(T value, T defaultValue) {
    return value == null ? defaultValue : value;
  }
}
