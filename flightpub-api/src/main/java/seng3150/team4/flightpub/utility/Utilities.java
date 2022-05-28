package seng3150.team4.flightpub.utility;

public class Utilities {
  public static <T> T getValueOrDefault(T value, T defaultValue) {
    return value == null ? defaultValue : value;
  }
}
