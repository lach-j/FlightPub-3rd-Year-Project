package seng3150.team4.flightpub.domain.models;

import java.util.Arrays;
import java.util.Optional;

public enum UserRole {
  STANDARD_USER(0),
  TRAVEL_AGENT(1),
  ADMINISTRATOR(2);

  private final int value;

  UserRole(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }

  public static Optional<UserRole> valueOf(int value) {
    return Arrays.stream(values()).filter(role -> role.value == value).findFirst();
  }
}
