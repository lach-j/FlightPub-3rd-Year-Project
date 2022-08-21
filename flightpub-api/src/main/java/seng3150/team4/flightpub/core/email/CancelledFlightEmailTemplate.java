package seng3150.team4.flightpub.core.email;

import lombok.Setter;

import java.util.Map;

public class CancelledFlightEmailTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-a546f4ed7df445d1b61e57f0a60a7802";
  private static final String FROM_NAME = "FlightPub";

  @Setter private String firstName;

  @Setter private String flightDetails;

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName, "flightDetails", flightDetails);
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
