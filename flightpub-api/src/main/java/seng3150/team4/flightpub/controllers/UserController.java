package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.controllers.requests.RegisterUserRequest;
import seng3150.team4.flightpub.controllers.requests.UpdateUserRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.SavedPayment;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.utility.PasswordHash;

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
  public EntityResponse<User> updateUserDetails(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
    request.validate();

    var user = userService.getUserByIdSecure(userId);


    if (!isNullOrEmpty(request.getEmail()))
      user.setEmail(request.getEmail());

    if (!isNullOrEmpty(request.getFirstName()))
      user.setFirstName(request.getFirstName());

    if (!isNullOrEmpty(request.getLastName()))
      user.setLastName(request.getLastName());

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
  @GetMapping
  public EntityCollectionResponse<SavedPayment> getAllSavedPayments() {
    return null;
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
