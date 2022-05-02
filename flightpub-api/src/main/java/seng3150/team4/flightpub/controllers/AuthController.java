package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.LoginRequest;
import seng3150.team4.flightpub.controllers.responses.TokenResponse;
import seng3150.team4.flightpub.services.IAuthenticationService;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final IAuthenticationService authenticationService;

    @PostMapping(path = "/login")
    public TokenResponse loginUser(@RequestBody LoginRequest loginRequest) {

        var token = authenticationService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        return new TokenResponse(token);
    }
}
