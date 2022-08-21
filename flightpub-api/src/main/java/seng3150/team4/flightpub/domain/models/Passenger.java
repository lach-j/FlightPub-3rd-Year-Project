package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "Passenger")
@NoArgsConstructor
@Entity
@Getter
@Setter
public class Passenger implements IEntity {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(name = "FirstName")
  private String firstName;

  @Column(name = "LastName")
  private String lastName;

  @Column(name = "Email")
  private String email;

  @JoinColumn(name = "ClassCode")
  @ManyToOne()
  private TicketClass ticketClass;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "BookingId")
  private Booking booking;
}
