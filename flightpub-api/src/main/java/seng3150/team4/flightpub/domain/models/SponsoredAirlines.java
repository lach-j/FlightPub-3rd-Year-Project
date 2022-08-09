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
@Table(name = "SponsoredAirlines")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SponsoredAirlines {
    @Column(name = "AirlineCode")
    @Id private String airlineCode;

    @Column(name = "AirlineName")
    private String airlineName;

    @Column(name = "CountryCode3")
    private String countryCode;

    @Column(name = "CovidStartDate")
    private LocalDateTime CovidStartDate;

    @Column(name = "CovidEndDate")
    private String CovidEndDate;
}
