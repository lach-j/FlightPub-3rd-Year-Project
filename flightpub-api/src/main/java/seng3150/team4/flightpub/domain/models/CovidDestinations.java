package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "CovidDestinations")
@NoArgsConstructor
@Getter
@Setter
@ToString

public class CovidDestinations implements IEntity, Serializable {

    @Column(name = "Id")
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "CovidStartDate")
    private LocalDateTime CovidStartDate;

    @Column(name = "CovidEndDate")
    private LocalDateTime CovidEndDate;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "LocationCode")
    private Set<Destination> destinations;
}
