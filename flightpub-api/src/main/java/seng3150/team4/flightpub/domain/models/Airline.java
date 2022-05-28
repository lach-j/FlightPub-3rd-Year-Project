package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "airlines")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Airline implements IEntity {
  @Id private String airlineCode;
  private String airlineName;

  @Column(name = "CountryCode3")
  private String countryCode;
}
