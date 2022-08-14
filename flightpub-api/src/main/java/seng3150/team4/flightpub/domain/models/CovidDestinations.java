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
@Table(name = "CovidDestinations")
@NoArgsConstructor
@Getter
@Setter
@ToString

public class CovidDestinations {

    @Column(name = "CovidCode")
    @Id private String CovidCode;

    @Column(name = "CovidStartDate")
    private LocalDateTime CovidStartDate;

    @Column(name = "CovidEndDate")
    private LocalDateTime CovidEndDate;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Destination> destinations;
}
