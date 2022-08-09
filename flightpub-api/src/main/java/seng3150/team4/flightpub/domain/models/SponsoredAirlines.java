package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/** models the Airlines table in the database */
@Entity
@Table(name = "SponsoredAirlines")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SponsoredAirlines {
    @Column(name = "SponsoredCode")
    @Id private String SponsoredCode;

    @Column(name = "SponsoredStartDate")
    private LocalDateTime CovidStartDate;

    @Column(name = "SponsoredEndDate")
    private String CovidEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AirlineCode", referencedColumnName = "SponsoredCode")
    private Set<Airline> airlines;
}
