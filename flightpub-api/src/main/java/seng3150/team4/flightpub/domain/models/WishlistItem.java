package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "WishlistItem")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WishlistItem {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Id;

  @JoinColumn(name = "DestinationCode")
  @ManyToOne
  private Destination destination;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "WishlistId")
  private Wishlist wishlist;

  @Column(name = "ItemRank")
  private int destinationRank;
}
