package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import seng3150.team4.flightpub.core.email.PasswordResetNotificationEmailTemplate;
import seng3150.team4.flightpub.core.email.ResetPasswordTemplate;
import seng3150.team4.flightpub.domain.models.ResetToken;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.repositories.IResetTokenRepository;
import seng3150.team4.flightpub.utility.PasswordHash;
import seng3150.team4.flightpub.utility.TokenGenerator;

import javax.persistence.EntityNotFoundException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;

import static seng3150.team4.flightpub.utility.TimeFunctions.minutesFromNow;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

  // Inject the required dependencies
  private final IUserService userService;
  private final IJwtHelperService jwtHelperService;
  private final IUrlResolverService urlResolverService;
  private final IResetTokenRepository resetTokenRepository;
  private final IEmailSenderService emailSenderService;

  private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

  @Override
  public String loginUser(String email, String password) {

    // Get the user from the database by email
    var user = userService.getUserByEmail(email);

    try {

      // Check if the provided password matches the saved password (hashed)
      if (!user.getPassword().equals(PasswordHash.PBKDF2WithHmacSHA1Hash(password, email)))
        return null;

      // Generate and return a JWT
      return jwtHelperService.generateToken(user);

    } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
      ex.printStackTrace();
    }

    // Return null if an error occurs
    return null;
  }

  @Override
  public void sendResetEmail(String email) {
    User user;
    try {
      // Get the user from the database
      user = userService.getUserByEmail(email);
    } catch (EntityNotFoundException ex) {
      // If the user does not exist then handle exception silently. For security/privacy reasons, we
      // do not want to
      // return this error as it will show if this email is registered on the system
      return;
    }
    try {
      // Generate a token to be used for password generation
      var token = TokenGenerator.generate(128);

      // Remove/invalidate any tokens that have been saved in the system for that user
      resetTokenRepository.removeTokensByUser(user.getId());

      // Save the new token to the database with an expiry time of 60 minutes
      resetTokenRepository.save(new ResetToken(token, user.getId(), minutesFromNow(60)));

      // Generate a reset email template
      var template = new ResetPasswordTemplate(urlResolverService.getUiUrl());
      template.setFirstName(user.getFirstName());
      template.setResetToken(token);

      // Send the email to the user
      emailSenderService.sendTemplateEmail(new Email(email), template);

    } catch (Exception e) {
      throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
  }

  @Override
  public void resetPassword(String token, String password) {

    // Find the reset token in the repository
    var resetToken = resetTokenRepository.findById(token);
    if (resetToken.isEmpty())
      throw new EntityNotFoundException("The token is invalid or has expired");

    // Delete/invalidate the token as it cannot be used again
    var foundToken = resetToken.get();
    resetTokenRepository.delete(foundToken);

    // Check if the token has expired
    if (foundToken.getExpiresAt().before(new Date())) {
      throw new EntityNotFoundException("The token is invalid or has expired");
    }

    // Find the user matching the token and change the password to the new password
    var user = userService.getUserById(foundToken.getUserId());

    var template = new PasswordResetNotificationEmailTemplate(urlResolverService.getUiUrl());
    template.setFirstName(user.getFirstName());
    emailSenderService.sendTemplateEmail(new Email(user.getEmail()), template);

    try {
      user.setPassword(PasswordHash.PBKDF2WithHmacSHA1Hash(password, user.getEmail()));
    } catch (InvalidKeySpecException | NoSuchAlgorithmException ex) {
      throw new RuntimeException("An error occurred while hashing the password " + ex.getMessage());
    }

    userService.updateUser(user);
  }
}
