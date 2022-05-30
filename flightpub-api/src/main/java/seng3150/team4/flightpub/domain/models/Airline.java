package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/** models the Airlines table in the database */
@Entity
@Table(name = "Airlines")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Airline implements IEntity {
  @Column(name = "AirlineCode")
  @Id private String airlineCode;

  @Column(name = "AirlineName")
  private String airlineName;

  @Column(name = "CountryCode3")
  private String countryCode;
}
