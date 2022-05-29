package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import seng3150.team4.flightpub.core.email.EmailTemplate;

/** Interface to define EmailSenderService methods */
public interface IEmailSenderService {
  void sendTemplateEmail(Email to, EmailTemplate template);
}
