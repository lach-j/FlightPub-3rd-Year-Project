package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "Passenger")
@NoArgsConstructor
@Getter
@Setter
public class Passenger implements IEntity {
    @Column(name = "FirstName")
    private String fname;

    @Column(name = "LastName")
    private String lname;

    @Column(name = "Email")
    private String email;

    @Column(name = "Class")
    private String sclass;

    @JoinColumn(foreignKey = @ForeignKey(name = "BookingId"))
    private long bookingId;
}
