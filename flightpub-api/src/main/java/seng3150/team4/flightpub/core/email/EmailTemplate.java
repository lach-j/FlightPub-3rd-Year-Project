package seng3150.team4.flightpub.core.email;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/** Base class for email templates */
@Getter
@Setter
public abstract class EmailTemplate {
  protected final String templateId;
  protected final String
      fromName; // Name that will appear on the email e.g. "FlightPub Support" or "FlightPub"

  // Convert class fields to map for SendGrid value replacement
  public abstract Map<String, Object> getMappedValues();

  public abstract String getTemplateId();

  public abstract String getFromName();

  EmailTemplate() {
    this.templateId = getTemplateId();
    this.fromName = getFromName();
  }
}
