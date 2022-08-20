package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** models the Airlines table in the database */
@Entity
@Table(name = "SponsoredAirline")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SponsoredAirline implements IEntity, Serializable {
    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @OneToOne
    @JoinColumn(name = "AirlineCode")
    private Airline airline;
}
