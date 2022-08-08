package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.core.email.RegisterEmailTemplate;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.domain.repositories.IUserRepository;
import seng3150.team4.flightpub.security.CurrentUserContext;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Collection;
import java.util.List;

/** Service used to provide logic for User management tasks. */
@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

  private final IUserRepository userRepository;
  private final IEmailSenderService emailSenderService;
  private final CurrentUserContext currentUserContext;

  // Registers a new user
  @Override
  public User registerUser(User user) {

    // If a user with this email already exists throw an exception.
    var duplicateUser = userRepository.findByEmail(user.getEmail());
    if (duplicateUser.isPresent())
      throw new EntityExistsException(
          String.format("User with email %s already exists", user.getEmail()));

    if (user.getRole() != UserRole.STANDARD_USER) {
      if (currentUserContext.getCurrentUserRole() != UserRole.ADMINISTRATOR) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            String.format(
                "Only users with the 'ADMINISTRATOR' role can create %s", user.getRole()));
      }
    }

    // Otherwise save the user
    User savedUser = userRepository.save(user);

    // Create a Registration email template containing the user data.
    var registerTemplate = new RegisterEmailTemplate();
    registerTemplate.setFirstName(savedUser.getFirstName());

    // Send the email template.
    emailSenderService.sendTemplateEmail(new Email(savedUser.getEmail()), registerTemplate);
    return savedUser;
  }

  // Updates the details of an existing user
  @Override
  public User updateUser(User user) {

    // If the user does not exist that throw an exception
    var userExists = userRepository.existsById(user.getId());
    if (!userExists)
      throw new EntityExistsException(String.format("User with id %s was not found", user.getId()));

    // Otherwise, save the updated user
    return userRepository.save(user);
  }

  @Override
  public void deleteUser(User user) {
    // If the user does not exist that throw an exception
    var userExists = userRepository.existsById(user.getId());
    if (!userExists)
      throw new EntityExistsException(String.format("User with id %s was not found", user.getId()));

    // Otherwise, delete the user
    userRepository.delete(user);
  }

  @Override
  public User getUserByEmail(String email) {
    // If the user does not exist that throw an exception
    var user = userRepository.findByEmail(email);
    if (user.isEmpty())
      throw new EntityNotFoundException(String.format("User with email %s was not found", email));

    // Otherwise, return the user
    return user.get();
  }

  @Override
  public User getUserById(long userId) {
    // If the user does not exist that throw an exception
    var user = userRepository.findById(userId);
    if (user.isEmpty())
      throw new EntityNotFoundException(String.format("User with id %s was not found", userId));
    // Otherwise, return the user
    return user.get();
  }

  @Override
  public User getUserByIdSecure(long userId) {
    if (currentUserContext.getCurrentUserId() != userId
        && (currentUserContext.getCurrentUserRole() != UserRole.ADMINISTRATOR
            || currentUserContext.getCurrentUserRole() != UserRole.TRAVEL_AGENT))
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "The current user does not have access to this users details");

    return getUserById(userId);
  }

  @Override
  public List<User> getUsersById(Collection<Long> userIds) {
    // If the users does not exist that throw an exception
    var users = userRepository.findAllById(userIds);
    if (users.isEmpty())
      throw new EntityNotFoundException("No users were found matching provided Ids");

    // Otherwise, return the users
    return users;
  }
}
