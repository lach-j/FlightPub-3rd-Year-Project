package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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

  private final IUserService userService;
  private final IJwtHelperService jwtHelperService;
  private final IUrlResolverService urlResolverService;
  private final IResetTokenRepository resetTokenRepository;
  private final IEmailSenderService emailSenderService;

  private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

  @Override
  public String loginUser(String email, String password) {
    var user = userService.getUserByEmail(email);

    try {
      if (!user.getPassword().equals(PasswordHash.PBKDF2WithHmacSHA1Hash(password, email)))
        return null;

      return jwtHelperService.generateToken(user);

    } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
      ex.printStackTrace();
    }
    return null;
  }

  @Override
  public void sendResetEmail(String email) {
    User user;
    try {
      user = userService.getUserByEmail(email);
    } catch (EntityNotFoundException ex) {
      return; // Handle this silently for security/privacy reasons.
    }
    try {
      var token = TokenGenerator.generate(128);
      resetTokenRepository.removeTokensByUser(user.getId());
      resetTokenRepository.save(new ResetToken(token, user.getId(), minutesFromNow(60)));

      var template = new ResetPasswordTemplate(urlResolverService.getUiUrl());
      template.setFirstName(user.getFirstName());
      template.setResetToken(token);

      emailSenderService.sendTemplateEmail(new Email(email), template);

    } catch (Exception e) {
      throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
  }

  @Override
  public void resetPassword(String token, String password) {
    var resetToken = resetTokenRepository.findById(token);
    if (resetToken.isEmpty())
      throw new EntityNotFoundException("The token is invalid or has expired");

    var foundToken = resetToken.get();
    resetTokenRepository.delete(foundToken);

    if (foundToken.getExpiresAt().before(new Date())) {
      throw new EntityNotFoundException("The token is invalid or has expired");
    }

    var user = userService.getUserById(foundToken.getUserId());
    try {
      user.setPassword(PasswordHash.PBKDF2WithHmacSHA1Hash(password, user.getEmail()));
    } catch (InvalidKeySpecException | NoSuchAlgorithmException ex) {
      // FIXME: again, terrible exception handling
      throw new RuntimeException("An error occurred while hashing the password " + ex.getMessage());
    }

    userService.updateUser(user);
  }
}
