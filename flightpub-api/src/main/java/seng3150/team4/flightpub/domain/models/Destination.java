package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

/** Models the Destination table in the database. */
@Entity
@Table(name = "Destinations")
@NoArgsConstructor
@Getter
@Setter
@ToString

public class Destination implements IEntity {
  @Column(name = "DestinationCode")
  @Id private String destinationCode;
  @Column(name = "Airport")
  private String airport;

  @Column(name = "CountryCode3")
  private String countryCode;
}
