package seng3150.team4.flightpub.core.email;

import lombok.Setter;

import java.util.Map;

/** EmailTemplate to be sent on user registration */
public class RegisterEmailTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-af64435362c24cf1a3b07ce57463e270";
  private static final String FROM_NAME = "FlightPub";

  @Setter private String firstName;

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName);
  }

  @Override
  public String getTemplateId() {
    return TEMPLATE_ID;
  }

  @Override
  public String getFromName() {
    return FROM_NAME;
  }
}
