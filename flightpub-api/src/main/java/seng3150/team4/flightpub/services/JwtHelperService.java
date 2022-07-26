package seng3150.team4.flightpub.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.User;

import static seng3150.team4.flightpub.utility.TimeFunctions.minutesFromNow;

/** Service to generate and verify JWTs for user Authentication/Authorization */
@Service
@RequiredArgsConstructor
public class JwtHelperService implements IJwtHelperService {

  private final UrlResolverService urlResolverService;

  // Generates a 24 hour token that holds the users id and is issued by the API.
  public String generateToken(User user) {

    // TODO: provide this secret from the configuration file
    Algorithm algorithm = Algorithm.HMAC256("secret");
    return JWT.create()
        .withIssuer(urlResolverService.getApiUrl())
        .withExpiresAt(minutesFromNow(60 * 24)) // expires after 24 hours
        .withClaim("id", user.getId())
        .withClaim("role", user.getRole().getValue()) // Add users role to the JWT
        .sign(algorithm);
  }

  // Verifies the integrity of the token and returns the decoded information
  public DecodedJWT verifyToken(String token) throws JWTVerificationException {
    Algorithm algorithm = Algorithm.HMAC256("secret");
    JWTVerifier verifier =
        JWT.require(algorithm).withIssuer(urlResolverService.getApiUrl()).build();
    return verifier.verify(token);
  }
}
