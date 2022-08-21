package seng3150.team4.flightpub.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.core.email.EmailTemplate;

import java.io.IOException;

@Service
public class EmailSenderService implements IEmailSenderService {

  private final Logger logger = LoggerFactory.getLogger(EmailSenderService.class);
  private final ObjectMapper mapper = new ObjectMapper();

  // Pull these values from the configuration file
  @Value("${flightpub.email.SENDGRID_API_KEY}")
  private String SENDGRID_API_KEY;

  @Value("${flightpub.email.support_email}")
  private String supportEmail;

  @Value("${flightpub.email.enabled}")
  private boolean EMAIL_ENABLED;

  public void sendTemplateEmail(Email to, EmailTemplate template) {
    var mail = new Mail();
    Personalization personalization = new Personalization();

    // Configure Dynamic Template
    mail.setTemplateId(template.getTemplateId());
    template.getMappedValues().forEach(personalization::addDynamicTemplateData);

    // Set email fields
    mail.setFrom(new Email(supportEmail, template.getFromName()));
    personalization.addTo(to);

    // Build and send
    mail.addPersonalization(personalization);
    try {
      // If email sending is disabled (i.e. development environment), log the email and don't send
      if (!EMAIL_ENABLED) {
        logger.info("EMAIL SENT {}", mapper.writeValueAsString(mail));
        return;
      }
      var res = sendEmail(mail);
      logger.info(
          "EMAIL SENT TO {} - STATUS {}, BODY {}, HEADERS {}",
          to.getEmail(),
          res.getStatusCode(),
          res.getBody(),
          res.getHeaders());
    } catch (IOException ex) {
      ex.printStackTrace();
      throw new RuntimeException("The email failed to send");
    }
  }

  private Response sendEmail(Mail mail) throws IOException {

    // Use the SendGrid API to send the email
    SendGrid sg = new SendGrid(SENDGRID_API_KEY);
    Request request = new Request();
    request.setMethod(Method.POST);
    request.setEndpoint("mail/send");
    request.setBody(mail.build());
    return sg.api(request);
  }
}
