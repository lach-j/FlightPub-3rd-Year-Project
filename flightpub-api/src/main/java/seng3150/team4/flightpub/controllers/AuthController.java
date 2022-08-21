package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.ForgotPasswordRequest;
import seng3150.team4.flightpub.controllers.requests.LoginRequest;
import seng3150.team4.flightpub.controllers.requests.ResetPasswordInternalRequest;
import seng3150.team4.flightpub.controllers.requests.ResetPasswordRequest;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.controllers.responses.TokenResponse;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.services.IAuthenticationService;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.utility.PasswordHash;

import javax.persistence.EntityNotFoundException;

@RestController
@RequiredArgsConstructor
public class AuthController {

  private final IAuthenticationService authenticationService;
  private final IUserService userService;
  private final Logger LOG = LoggerFactory.getLogger(AuthController.class);

  @PostMapping(path = "/login")
  public ResponseEntity<? extends Response> loginUser(@RequestBody LoginRequest loginRequest) {

    // Validate the request
    loginRequest.validate();

    // Attempt to login the user with the provided credentials

    String token;

    try {
      token = authenticationService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
    } catch (EntityNotFoundException ex) {
      token = null;
    }

    // If the login was not successful then respond with an error
    if (token == null)
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(
              new StatusResponse(HttpStatus.UNAUTHORIZED)
                  .message("The email or password provided is incorrect."));

    var user = userService.getUserByEmail(loginRequest.getEmail());

    // Otherwise, return the JWT
    return ResponseEntity.ok(new TokenResponse(HttpStatus.OK, token, user));
  }

  @PostMapping(path = "/reset")
  public ResponseEntity<? extends Response> resetPasswordWithToken(
      @RequestBody ResetPasswordRequest loginRequest) {

    // Validate the request
    loginRequest.validate();

    try {
      // Attempt to reset the password using the provided token
      authenticationService.resetPassword(loginRequest.getToken(), loginRequest.getPassword());
    } catch (EntityNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new StatusResponse(HttpStatus.UNAUTHORIZED, ex.getMessage()));
    }
    // Send success response
    return ResponseEntity.ok(
        new StatusResponse(HttpStatus.OK).message("The password was reset successfully"));
  }

  @Authorized
  @PostMapping(path = "/reset/{userId}")
  public ResponseEntity<? extends Response> resetPasswordFromAccount(
      @RequestBody ResetPasswordInternalRequest request, @PathVariable long userId) {
    request.validate();
    var user = userService.getUserByIdSecure(userId);
    try {
      user.setPassword(PasswordHash.PBKDF2WithHmacSHA1Hash(request.getPassword(), user.getEmail()));
      return ResponseEntity.ok(new EntityResponse<>(userService.updateUser(user)));
    } catch (Exception e) {
      LOG.warn("Hash failed");
    }
    return ResponseEntity.internalServerError()
        .body(new StatusResponse(HttpStatus.OK).message("Hash failed"));
  }

  @PostMapping(path = "/forgot")
  public ResponseEntity<? extends Response> sendResetEmail(
      @RequestBody ForgotPasswordRequest forgotPasswordRequest) {

    // Validate the request
    forgotPasswordRequest.validate();

    // Send a reset email to the provided email
    authenticationService.sendResetEmail(forgotPasswordRequest.getEmail());

    // Return "Accepted" response
    return ResponseEntity.accepted().body(new StatusResponse(HttpStatus.ACCEPTED));
  }
}
