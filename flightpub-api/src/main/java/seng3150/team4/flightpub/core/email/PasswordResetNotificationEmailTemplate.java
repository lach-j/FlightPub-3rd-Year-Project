package seng3150.team4.flightpub.core.email;

import lombok.Setter;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

public class PasswordResetNotificationEmailTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-4e16e925d18a406586c3012316603898";
  private static final String FROM_NAME = "FlightPub Support";

  @Setter private String firstName;

  private final String UI_URL;

  public PasswordResetNotificationEmailTemplate(String UI_URL) {
    this.UI_URL = UI_URL;
  }

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName, "resetLink", getForgotPasswordUrl());
  }

  private String getForgotPasswordUrl() {
    return UriComponentsBuilder.fromHttpUrl(UI_URL).path("forgot").build().toUriString();
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
