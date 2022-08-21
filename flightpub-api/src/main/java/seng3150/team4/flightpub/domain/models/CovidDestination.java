package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

/** models the CovidDestination table in the database */
@Entity
@Table(name = "CovidDestination")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CovidDestination implements IEntity, Serializable {

  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(name = "CovidStartDate")
  private LocalDate covidStartDate;

  @Column(name = "CovidEndDate")
  private LocalDate covidEndDate;

  @JsonManagedReference
  @OneToOne
  @JoinColumn(name = "DestinationCode")
  private Destination destination;
}
