package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

/** models the Airlines table in the database */
@Entity
@Table(name = "CovidDestinations")
@NoArgsConstructor
@Getter
@Setter
@ToString

public class CovidDestinations {
    @Column(name = "DestinationCode")
    @Id private String destinationCode;
    @Column(name = "Airport")
    private String airport;

    @Column(name = "CountryCode3")
    private String countryCode;

    @Column(name = "SponsoredStartDate")
    private LocalDateTime SponsoredStartDate;

    @Column(name = "SponsoredEndDate")
    private LocalDateTime SponsoredEndDate;
}
