package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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
}
