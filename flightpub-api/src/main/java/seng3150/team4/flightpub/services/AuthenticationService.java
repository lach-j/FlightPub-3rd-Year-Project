package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.utility.PasswordHash;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final IUserService userService;

    @Override
    public String loginUser(String email, String password) {
        var user = userService.getUserByEmail(email);
        try {
            if (Objects.equals(user.getPassword(), PasswordHash.PBKDF2WithHmacSHA1Hash(password, email)))
                return "// TODO: REPLACE THIS WITH TOKEN GENERATION";
        } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
            ex.printStackTrace();
        }
        return null;
    }

}
