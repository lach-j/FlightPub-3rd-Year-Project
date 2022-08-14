package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/** models the Airlines table in the database */
@Entity
@Table(name = "CanceledFlights")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CanceledFlights {
    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @OneToOne(fetch = FetchType.LAZY)
//    either (name = "FlightId", referencedColumnName = "Id")
    @JoinColumn(name = "Id")
    private Flight flights;

    @Column(name = "Canceled")
    private boolean Canceled;
}
