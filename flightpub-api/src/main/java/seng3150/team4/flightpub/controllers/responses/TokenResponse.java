package seng3150.team4.flightpub.controllers.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class TokenResponse {

    public TokenResponse(String token) {
        this.token = token;
    }

    private String token;
}
