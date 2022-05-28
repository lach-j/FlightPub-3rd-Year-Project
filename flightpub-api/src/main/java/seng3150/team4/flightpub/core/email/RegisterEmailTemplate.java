package seng3150.team4.flightpub.core.email;

import lombok.Setter;

import java.util.Map;

public class RegisterEmailTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-af64435362c24cf1a3b07ce57463e270";
  private static final String FROM_NAME = "FlightPub";

  @Setter private String firstName;

  public RegisterEmailTemplate() {
    super(TEMPLATE_ID, FROM_NAME);
  }

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName);
  }
}
