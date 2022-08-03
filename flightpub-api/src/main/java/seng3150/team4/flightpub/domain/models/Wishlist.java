package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Wishlist")
@NoArgsConstructor
@Getter
@Setter
public class Wishlist implements IEntity {

    @Id
    @Column(name = "Id")
    private Long id;

    @Column(name = "DateCreated")
    private LocalDateTime dateCreated;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "UserId", referencedColumnName = "Id")
    private User user;

    @JsonManagedReference
    @ManyToMany
    @JoinTable(name = "Wishlist_Destination",
            joinColumns=@JoinColumn(name="WishlistId", referencedColumnName = "Id"),
            inverseJoinColumns=@JoinColumn(name="DestinationCode", referencedColumnName = "DestinationCode", columnDefinition = "CHAR(3)"))
    private Set<Destination> destinations;
}
