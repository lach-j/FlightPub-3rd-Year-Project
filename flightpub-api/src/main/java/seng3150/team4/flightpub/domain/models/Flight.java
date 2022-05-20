package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@IdClass(FlightId.class)
@Table(name = "flights")
public class Flight implements IEntity, Serializable {

    @Id
    private String airlineCode;
    @Id
    private String flightNumber;
    @Id
    private LocalDateTime departureTime;

    private String departureCode;
    private String stopOverCode;
    private String destinationCode;
    private LocalDateTime arrivalTimeStopOver;
    private LocalDateTime departureTimeStopOver;
    private LocalDateTime arrivalTime;
    private int duration;
    private Integer durationSecondLeg;
}
