package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.ForgotPasswordRequest;
import seng3150.team4.flightpub.controllers.requests.LoginRequest;
import seng3150.team4.flightpub.controllers.requests.ResetPasswordRequest;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.controllers.responses.TokenResponse;
import seng3150.team4.flightpub.services.IAuthenticationService;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final IAuthenticationService authenticationService;

    @PostMapping(path = "/login")
    public ResponseEntity<? extends Response> loginUser(@RequestBody LoginRequest loginRequest) {

        var token = authenticationService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (token == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            new StatusResponse(HttpStatus.UNAUTHORIZED)
                            .message("The email or password provided is incorrect.")
                    );

        return ResponseEntity.ok(new TokenResponse(HttpStatus.OK, token));
    }

    @PostMapping(path = "/reset")
    public ResponseEntity<? extends Response> resetPasswordWithToken(@RequestBody ResetPasswordRequest loginRequest) {
        authenticationService.resetPassword(
                loginRequest.getToken(),
                loginRequest.getPassword()
        );

        return ResponseEntity.ok(new StatusResponse(HttpStatus.OK).message("The password was reset successfully"));
    }

    @PostMapping(path = "/forgot")
    public ResponseEntity<? extends Response> sendResetEmail(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authenticationService.sendResetEmail(forgotPasswordRequest.getEmail());
        return ResponseEntity.accepted().body(new StatusResponse(HttpStatus.ACCEPTED));
    }
}
