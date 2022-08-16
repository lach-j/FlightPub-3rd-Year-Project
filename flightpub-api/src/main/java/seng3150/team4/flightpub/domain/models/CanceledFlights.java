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

/** models the Airlines table in the database */
@Entity
@Table(name = "CanceledFlights")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CanceledFlights implements IEntity, Serializable {
    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FlightId")
    private Flight flights;

}
