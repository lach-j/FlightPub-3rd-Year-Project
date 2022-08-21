package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "Flights")
public class Flight implements IEntity, Serializable {

  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @JoinColumn(name = "AirlineCode")
  private Airline airline;

  @Column(name = "FlightNumber")
  private String flightNumber;

  @Column(name = "DepartureTime")
  private LocalDateTime departureTime;

  @Column(name = "ArrivalTimeStopOver")
  private LocalDateTime arrivalTimeStopOver;

  @Column(name = "DepartureTimeStopOver")
  private LocalDateTime departureTimeStopOver;

  @Column(name = "ArrivalTime")
  private LocalDateTime arrivalTime;

  @Column(name = "Duration")
  private int duration;

  @Column(name = "DurationSecondLeg")
  private Integer durationSecondLeg;

  @ManyToOne
  @JoinColumn(name = "DepartureCode", nullable = false)
  private Destination departureLocation;

  @ManyToOne
  @JoinColumn(name = "DestinationCode", nullable = false)
  private Destination arrivalLocation;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  @ManyToOne
  @JoinColumn(name = "StopOverCode")
  private Destination stopOverLocation;

  @Column(name = "Cancelled")
  private boolean cancelled;

  @JsonManagedReference
  @OneToMany
  @JoinColumn(name = "FlightId", referencedColumnName = "Id")
  private Set<Price> prices;
}
