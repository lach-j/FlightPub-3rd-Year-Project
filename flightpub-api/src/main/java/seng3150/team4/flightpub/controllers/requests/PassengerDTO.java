package seng3150.team4.flightpub.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PassengerDTO {
  private String firstName;
  private String lastName;
  private String email;
  private String ticketClass;
}
