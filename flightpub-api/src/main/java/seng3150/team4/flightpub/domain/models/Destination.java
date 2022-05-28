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
@Table(name = "destinations")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Destination implements IEntity {
  @Id private String destinationCode;
  private String airport;

  @Column(name = "CountryCode3")
  private String countryCode;
}
