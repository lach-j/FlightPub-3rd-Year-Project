package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Booking implements IEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private long userId;

  @ManyToMany
  @JoinTable(
      name = "bookFlight",
      joinColumns = {@JoinColumn(name = "bookingId")},
      inverseJoinColumns = {@JoinColumn(name = "flightId")})
  private Set<Flight> flights = new HashSet<>();

  private LocalDateTime dateBooked;
}
