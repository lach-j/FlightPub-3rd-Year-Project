package seng3150.team4.flightpub.core.email;

import lombok.Setter;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/** EmailTemplate to be sent when requesting a password reset. */
public class ResetPasswordTemplate extends EmailTemplate {

  private static final String TEMPLATE_ID = "d-ab61283fd041483ab1b1b6cfe2f4cc9f";
  private static final String FROM_NAME = "FlightPub Support";

  @Setter private String firstName;
  @Setter private String resetToken;

  private final String UI_URL;

  public ResetPasswordTemplate(String uiUrl) {
    this.UI_URL = uiUrl;
  }

  // Build the url that will be sent to the user to reset their password
  private String getResetTokenUrl() {
    return UriComponentsBuilder.fromHttpUrl(UI_URL)
        .path("reset")
        .queryParam("token", URLEncoder.encode(resetToken, StandardCharsets.UTF_8))
        .build()
        .toUriString();
  }

  @Override
  public Map<String, Object> getMappedValues() {
    return Map.of("firstName", firstName, "resetUrl", getResetTokenUrl());
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
