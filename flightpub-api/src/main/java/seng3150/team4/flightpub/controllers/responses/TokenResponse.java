package seng3150.team4.flightpub.controllers.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@NoArgsConstructor
@Getter
@Setter
public class TokenResponse extends StatusResponse {

    public TokenResponse(HttpStatus status, String token) {
        super(status);
        this.token = token;
    }

    private String token;
}
