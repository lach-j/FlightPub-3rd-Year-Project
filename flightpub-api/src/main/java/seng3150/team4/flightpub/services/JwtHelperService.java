package seng3150.team4.flightpub.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.User;

import java.util.Calendar;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtHelperService implements IJwtHelperService {

    private final UrlResolverService urlResolverService;

    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        return JWT.create()
                .withIssuer(urlResolverService.getApiUrl())
                .withExpiresAt(minutesFromNow(60 * 24))
                .withClaim("id", user.getId())
                .sign(algorithm);
    }

    public DecodedJWT verifyToken(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(urlResolverService.getApiUrl())
                .build();
        return verifier.verify(token);
    }

    private static Date minutesFromNow(long minutes) {
        Calendar date = Calendar.getInstance();
        long timeInSecs = date.getTimeInMillis();
        return new Date(timeInSecs + (minutes * 60 * 1000));
    }
}
