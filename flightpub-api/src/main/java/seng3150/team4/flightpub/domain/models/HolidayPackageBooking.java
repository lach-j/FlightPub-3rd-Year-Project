package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "HolidayPackageBooking")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class HolidayPackageBooking implements IEntity {
    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "UserId")
    private long userId;

    @ManyToMany
    @JoinTable(
            name = "HolidayPackageBookedFlights",
            joinColumns = {@JoinColumn(name = "HolidayPackageBookingId")},
            inverseJoinColumns = {@JoinColumn(name = "FlightBookingId")})
    private Set<Booking> flightBookings = new HashSet<>();

    @Column(name = "DateBooked")
    private LocalDateTime dateBooked;
}