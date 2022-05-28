package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import seng3150.team4.flightpub.Price;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "flights")
public class Flight implements IEntity, Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long Id;

  private String airlineCode;
  private String flightNumber;
  private LocalDateTime departureTime;

  private LocalDateTime arrivalTimeStopOver;
  private LocalDateTime departureTimeStopOver;
  private LocalDateTime arrivalTime;
  private int duration;
  private Integer durationSecondLeg;

  @ManyToOne
  @JoinColumn(name = "departureCode", nullable = false)
  private Destination departureLocation;

  @ManyToOne
  @JoinColumn(name = "destinationCode", nullable = false)
  private Destination arrivalLocation;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  @ManyToOne
  @JoinColumn(name = "stopOverCode")
  private Destination stopOverLocation;

  @JsonManagedReference
  @OneToMany
  @JoinColumn(name = "FlightId", referencedColumnName = "Id")
  private Set<Price> prices;
}
