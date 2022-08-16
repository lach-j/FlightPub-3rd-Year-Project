package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

/** models the Airlines table in the database */
@Entity
@Table(name = "SponsoredAirlines")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SponsoredAirlines implements IEntity, Serializable {
    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "SponsoredStartDate")
    private LocalDateTime CovidStartDate;

    @Column(name = "SponsoredEndDate")
    private String CovidEndDate;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Airline> airlines;
}
