package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "Booking")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Booking implements IEntity {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(name = "UserId")
  private long userId;

  @ManyToMany
  @JoinTable(
      name = "BookFlight",
      joinColumns = {@JoinColumn(name = "BookingId")},
      inverseJoinColumns = {@JoinColumn(name = "FlightId")})
  private Set<Flight> flights = new HashSet<>();

  @Column(name = "DateBooked")
  private LocalDateTime dateBooked;
}
