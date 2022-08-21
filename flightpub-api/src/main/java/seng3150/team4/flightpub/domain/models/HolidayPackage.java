package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "HolidayPackage")
public class HolidayPackage implements IEntity {

  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "isPopular")
  private Boolean isPopular;

  @Column(name = "imageURL")
  private String imageURL;

  @Column(name = "packageName")
  private String packageName;

  @Column(name = "packageDescription")
  private String packageDescription;

  @Column(name = "packageTagline")
  private String packageTagline;

  @Column(name = "packageNights")
  private Integer packageNights;

  @Column(name = "location")
  private String location;

  @Column(name = "price")
  private Integer price;

  @Column(name = "arrivalLocation")
  private String arrivalLocation;

  @Column(name = "accommodation")
  private String accommodation;

  @ManyToMany
  @JoinTable(
      name = "HolidayPackageFlights",
      joinColumns = {@JoinColumn(name = "HolidayPackageId")},
      inverseJoinColumns = {@JoinColumn(name = "FlightId")})
  private Set<Flight> flights = new HashSet<>();
}
