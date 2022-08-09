package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.controllers.requests.*;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.utility.PasswordHash;

import java.util.Set;
import java.util.stream.Collectors;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

  // Inject dependencies
  private final IUserService userService;
  private final CurrentUserContext currentUserContext;

  @PostMapping
  public ResponseEntity<? extends Response> registerUser(
      @RequestBody RegisterUserRequest registerUserRequest) {
    registerUserRequest.validate();

    // Create a user from the request
    var user = userFromRequest(registerUserRequest);

    // Save the user to the database and send registration email
    var savedUser = userService.registerUser(user);

    // return saved used
    return ResponseEntity.ok().body(new EntityResponse<>(savedUser));
  }

  @Authorized
  @GetMapping("/{userId}")
  public EntityResponse<User> getUserById(@PathVariable Long userId) {
    var user = userService.getUserByIdSecure(userId);
    return new EntityResponse<>(user);
  }

  @Authorized
  @PatchMapping("/{userId}")
  public EntityResponse<User> updateUserDetails(
      @PathVariable Long userId, @RequestBody UpdateUserRequest request) {
    request.validate();

    var user = userService.getUserByIdSecure(userId);

    if (!isNullOrEmpty(request.getEmail())) user.setEmail(request.getEmail());

    if (!isNullOrEmpty(request.getFirstName())) user.setFirstName(request.getFirstName());

    if (!isNullOrEmpty(request.getLastName())) user.setLastName(request.getLastName());

    return new EntityResponse<>(userService.updateUser(user));
  }

  @Authorized
  @DeleteMapping("/{userId}")
  public StatusResponse deleteUseById(@PathVariable Long userId) {
    var user = userService.getUserByIdSecure(userId);
    userService.deleteUser(user);
    return new StatusResponse(HttpStatus.OK);
  }

  @Authorized
  @GetMapping("/{userId}/payments")
  public EntityCollectionResponse<SavedPayment> getAllSavedPayments(@PathVariable long userId) {
    var user = userService.getUserByIdSecure(userId);

    var obfuscatedPaymentData = obfuscatePaymentInformation(user.getPayments());

    return new EntityCollectionResponse<>(obfuscatedPaymentData);
  }

  @Authorized
  @GetMapping("/{userId}/payments/{paymentId}")
  public EntityResponse<SavedPayment> getPaymentById(
      @PathVariable long userId, @PathVariable long paymentId) {
    var user = userService.getUserByIdSecure(userId);

    var obfuscatedPaymentData = obfuscatePaymentInformation(user.getPayments());
    var payment = obfuscatedPaymentData.stream().filter(p -> p.getId() == paymentId).findFirst();

    if (payment.isEmpty())
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "A payment with this Id was not found");

    return new EntityResponse<>(payment.get());
  }

  @Authorized
  @PostMapping("/{userId}/payments")
  public EntityResponse<SavedPayment> updatePaymentDetails(
      @PathVariable long userId, @RequestBody PaymentRequest request) {
    request.validate();
    var payment = resolvePaymentFromRequest(request);

    var savedPayment = userService.addNewPayment(userId, payment);

    var obfuscated = obfuscatePaymentInformation(Set.of(savedPayment)).stream().findFirst().get();
    return new EntityResponse<>(obfuscated);
  }

  @Authorized
  @PatchMapping("/{userId}/payments/{paymentId}")
  public EntityResponse<SavedPayment> updatePaymentDetails(
          @PathVariable long userId, @PathVariable long paymentId, @RequestBody UpdatePaymentRequest request) {
    request.validate();
    var payment = resolvePaymentFromRequest(request);

    var savedPayment = userService.updatePayment(userId, paymentId, payment);

    var obfuscated = obfuscatePaymentInformation(Set.of(savedPayment)).stream().findFirst().get();
    return new EntityResponse<>(obfuscated);
  }

  private static SavedPayment resolvePaymentFromRequest(IPaymentRequest request) {
    if (request.getType() == SavedPayment.PaymentType.PAYPAL) {
      var payment = new SavedPaymentPaypal();
      payment.setEmail(request.getEmail());
      payment.setType(request.getType());
      payment.setNickname(request.getNickname());
      return payment;
    }

    if (request.getType() == SavedPayment.PaymentType.DIRECT_DEBIT) {
      var payment = new SavedPaymentDirectDebit();
      payment.setAccountName(request.getAccountName());
      payment.setAccountNumber(request.getAccountNumber());
      payment.setBsb(request.getBsb());
      payment.setType(request.getType());
      payment.setNickname(request.getNickname());
      return payment;
    }

    if (request.getType() == SavedPayment.PaymentType.CARD) {
      var payment = new SavedPaymentCard();
      payment.setCardNumber(request.getCardNumber());
      payment.setCardholder(request.getCardholder());
      payment.setCcv(request.getCcv());
      payment.setType(request.getType());
      payment.setExpiryDate(request.getExpiryDate());
      payment.setNickname(request.getNickname());
      return payment;
    }

    return new SavedPayment();
  }

  private static Set<SavedPayment> obfuscatePaymentInformation(Set<SavedPayment> savedPaymentSet) {
    return savedPaymentSet.stream()
        .map(
            p -> {
              if (p instanceof SavedPaymentCard) {
                SavedPaymentCard cardPayment = (SavedPaymentCard) p;
                cardPayment.setCcv("");
                var currentNumber = cardPayment.getCardNumber();
                if (currentNumber.length() <= 4)
                  return cardPayment;
                cardPayment.setCardNumber(
                    "************" + currentNumber.substring(currentNumber.length() - 4));
                return cardPayment;
              }
              return p;
            })
        .collect(Collectors.toSet());
  }

  private static User userFromRequest(RegisterUserRequest request) {
    User user = new User();

    // Hash password for new user
    try {
      user.setPassword(
          PasswordHash.PBKDF2WithHmacSHA1Hash(request.getPassword(), request.getEmail()));
    } catch (Exception ex) {
      throw new RuntimeException("Password hash failed");
    }

    // set all other fields
    user.setEmail(request.getEmail());
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setRole(request.getRole());

    // return user
    return user;
  }
}
