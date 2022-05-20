package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.RegisterUserRequest;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.utility.PasswordHash;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @PostMapping(path = "/users")
    public ResponseEntity<? extends Response> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        registerUserRequest.validate();

        var user = userFromRequest(registerUserRequest);

        var savedUser = userService.registerUser(user);

        return ResponseEntity.ok().body(new EntityResponse<>(savedUser));
    }

    private static User userFromRequest(RegisterUserRequest request) {
        User user = new User();

        try {
            user.setPassword(PasswordHash.PBKDF2WithHmacSHA1Hash(request.getPassword(), request.getEmail()));
        } catch (Exception ex) {
            throw new RuntimeException("Password hash failed");
        }

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        return user;
    }

}
