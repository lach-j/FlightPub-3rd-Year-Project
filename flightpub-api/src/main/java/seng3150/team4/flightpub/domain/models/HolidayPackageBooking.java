package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name = "HolidayPackageBooking")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class HolidayPackageBooking implements IEntity {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "UserId")
  private User user;

  @ManyToOne
  @JoinColumn(name = "HolidayPackageId", referencedColumnName = "Id")
  private HolidayPackage holidayPackage;

  @Column(name = "DateBooked")
  private LocalDateTime dateBooked;

  @ManyToOne
  @JoinColumn(name = "PaymentId", referencedColumnName = "Id")
  private Payment payment;

  @ManyToOne
  @JoinColumn(name = "BookingId", referencedColumnName = "Id")
  private Booking booking;
}
