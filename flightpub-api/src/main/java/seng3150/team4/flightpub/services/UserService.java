package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.core.email.RegisterEmailTemplate;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.repositories.ISavedPaymentRepository;
import seng3150.team4.flightpub.domain.repositories.IUserRepository;
import seng3150.team4.flightpub.security.CurrentUserContext;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

/** Service used to provide logic for User management tasks. */
@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

  private final IUserRepository userRepository;
  private final IEmailSenderService emailSenderService;
  private final CurrentUserContext currentUserContext;
  private final ISavedPaymentRepository savedPaymentRepository;

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
    var duplicate = userRepository.findByEmail(user.getEmail());

    if (duplicate.isPresent() && duplicate.get().getId() != user.getId())
      throw new EntityExistsException(
          String.format("User with email %s already exists", user.getEmail()));

    if (!userExists)
      throw new EntityNotFoundException(
          String.format("User with id %s was not found", user.getId()));

    // Otherwise, save the updated user
    return userRepository.save(user);
  }

  @Override
  public void deleteUser(User user) {
    // If the user does not exist that throw an exception
    var storedUser = getUserByIdSecure(user.getId());

    // Otherwise, delete the user
    storedUser.setDeleted(true);
    userRepository.save(storedUser);
  }

  @Override
  public User getUserByEmail(String email) {
    // If the user does not exist that throw an exception
    var user = userRepository.findByEmail(email);
    if (user.isEmpty() || user.get().isDeleted())
      throw new EntityNotFoundException(String.format("User with email %s was not found", email));

    // Otherwise, return the user
    return user.get();
  }

  public User getUserByEmailSecure(String email) {

    var user = getUserByEmail(email);

    if (currentUserContext.getCurrentUserId() != user.getId()
        && currentUserContext.getCurrentUserRole() != UserRole.ADMINISTRATOR
        && currentUserContext.getCurrentUserRole() != UserRole.TRAVEL_AGENT)
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "The current user does not have access to this users details");

    return user;
  }

  @Override
  public User getUserById(long userId) {
    // If the user does not exist that throw an exception
    var user = userRepository.findById(userId);
    if (user.isEmpty() || user.get().isDeleted())
      throw new EntityNotFoundException(String.format("User with id %s was not found", userId));
    // Otherwise, return the user
    return user.get();
  }

  @Override
  public User getUserByIdSecure(long userId) {

    if (currentUserContext.getCurrentUserId() != userId
        && currentUserContext.getCurrentUserRole() != UserRole.ADMINISTRATOR
        && currentUserContext.getCurrentUserRole() != UserRole.TRAVEL_AGENT)
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "The current user does not have access to this users details");

    return getUserById(userId);
  }

  @Override
  public List<User> getUsersById(Collection<Long> userIds) {
    // If the users does not exist that throw an exception
    var users =
        userRepository.findAllById(userIds).stream()
            .filter(u -> !u.isDeleted())
            .collect(Collectors.toList());
    if (users.isEmpty())
      throw new EntityNotFoundException("No users were found matching provided Ids");

    // Otherwise, return the users
    return users;
  }

  @Override
  public SavedPayment addNewPayment(long userId, SavedPayment payment) {
    var user = getUserByIdSecure(userId);

    payment.setUser(user);

    return savedPaymentRepository.save(payment);
  }

  @Override
  public SavedPayment updatePayment(long userId, long paymentId, SavedPayment payment) {
    var user = getUserByIdSecure(userId);

    var existingPayment =
        user.getPayments().stream().filter(p -> p.getId() == paymentId).findFirst();

    if (existingPayment.isEmpty())
      throw new EntityNotFoundException(
          String.format("A payment with id %d was not found.", paymentId));

    var updatablePayment = existingPayment.get();

    if (!payment.getClass().equals(updatablePayment.getClass()))
      throw new UnsupportedOperationException();

    updateChangedDetails(updatablePayment, payment);

    return savedPaymentRepository.save(updatablePayment);
  }

  @Override
  public void deletePayment(long userId, long paymentId) {
    var user = getUserByIdSecure(userId);

    var existingPayment =
        user.getPayments().stream().filter(p -> p.getId() == paymentId).findFirst();

    if (existingPayment.isEmpty())
      throw new EntityNotFoundException(
          String.format("A payment with id %d was not found.", paymentId));

    var deletablePayment = existingPayment.get();

    savedPaymentRepository.delete(deletablePayment);
  }

  private static void updateChangedDetails(
      SavedPayment updatableSavedPayment, SavedPayment savedPayment) {

    updateIfNotNull(savedPayment.getNickname(), updatableSavedPayment::setNickname);

    var updatablePayment = updatableSavedPayment.getPayment();
    var payment = savedPayment.getPayment();

    if (updatablePayment instanceof PaymentPaypal) {
      var up = (PaymentPaypal) updatablePayment;
      var p = (PaymentPaypal) payment;

      updateIfNotNull(p.getEmail(), up::setEmail);
    }

    if (updatablePayment instanceof PaymentCard) {
      var up = (PaymentCard) updatablePayment;
      var p = (PaymentCard) payment;

      updateIfNotNull(p.getCardNumber(), up::setCardNumber);
      updateIfNotNull(p.getCardholder(), up::setCardholder);
      updateIfNotNull(p.getCcv(), up::setCcv);
      updateIfNotNull(p.getExpiryDate(), up::setExpiryDate);
    }

    if (updatablePayment instanceof PaymentDirectDebit) {
      var up = (PaymentDirectDebit) updatablePayment;
      var p = (PaymentDirectDebit) payment;

      updateIfNotNull(p.getAccountName(), up::setAccountName);
      updateIfNotNull(p.getAccountNumber(), up::setAccountNumber);
      updateIfNotNull(p.getBsb(), up::setBsb);
    }
  }

  private static <T> void updateIfNotNull(T value, Consumer<T> setter) {
    if (isNullOrEmpty(value)) return;
    setter.accept(value);
  }
}
