package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final IUserService userService;

    public String loginUser(String email, String password) {
        var user = userService.getUserByEmail(email);

        return null;
        //TODO: IMPLEMENT PASSWORD HASHING AND JWT GENERATION
    }

}
