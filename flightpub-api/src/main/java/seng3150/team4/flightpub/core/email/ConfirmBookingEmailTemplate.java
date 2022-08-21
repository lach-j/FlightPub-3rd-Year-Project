package seng3150.team4.flightpub.core.email;

import lombok.Setter;

import java.util.Map;

public class ConfirmBookingEmailTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-dd1b5177a94b41cbb3b169a5c66b913a";
  private static final String FROM_NAME = "FlightPub";

  @Setter private String firstName;

  @Setter private String bookingDetails;

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName, "bookingDetails", bookingDetails);
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
