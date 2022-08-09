package seng3150.team4.flightpub.domain.models;

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
    private String fname;

    @Column(name = "LastName")
    private String lname;

    @Column(name = "Email")
    private String email;

    @JoinColumn(foreignKey = @ForeignKey(name = "BookingId"))
    private long bookingId;
}
