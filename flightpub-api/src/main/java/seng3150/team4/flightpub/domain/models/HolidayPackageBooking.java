package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private long id;

    @Column(name = "UserId")
    private long userId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "holidayPackageId", nullable = false)
    private HolidayPackage holidayPackage;

    @Column(name = "DateBooked")
    private LocalDateTime dateBooked;
}