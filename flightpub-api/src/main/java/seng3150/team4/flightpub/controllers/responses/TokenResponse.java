package seng3150.team4.flightpub.controllers.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import seng3150.team4.flightpub.domain.models.User;

/** Extends StatusResponse, includes field for JWT */
@NoArgsConstructor
@Getter
@Setter
public class TokenResponse extends StatusResponse {

  public TokenResponse(HttpStatus status, String token, User user) {
    super(status);
    this.token = token;
    this.user = user;
  }

  private String token;
  private User user;
}
