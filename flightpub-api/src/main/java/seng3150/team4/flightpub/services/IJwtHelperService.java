package seng3150.team4.flightpub.services;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import seng3150.team4.flightpub.domain.models.User;

/** Interface to define JwtHelperService methods */
public interface IJwtHelperService {
  DecodedJWT verifyToken(String token) throws JWTVerificationException;

  String generateToken(User user);
}
