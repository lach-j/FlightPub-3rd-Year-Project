package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

/** models the Airlines table in the database */
@Entity
@Table(name = "SponsoredAirline")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SponsoredAirline implements IEntity, Serializable {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "StartDate")
  private LocalDate startDate;

  @Column(name = "EndDate")
  private LocalDate endDate;

  @JsonBackReference
  @OneToOne
  @JoinColumn(name = "AirlineCode")
  private Airline airline;
}
