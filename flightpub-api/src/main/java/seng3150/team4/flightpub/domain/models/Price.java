package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@IdClass(PriceId.class)
@Table(name = "Price")
@Getter
@Setter
public class Price {
  @Column(name = "FlightId")
  @JsonIgnore
  @Id
  private Long flightId;

  @ManyToOne
  @JoinColumn(name = "ClassCode")
  @Id
  private TicketClass ticketClass;

  @JsonBackReference
  @MapsId("flightId")
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "FlightId", nullable = false)
  private Flight flight;

  @Column(name = "Price", nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  @Column(name = "PriceLeg1", precision = 10, scale = 2)
  private BigDecimal priceLeg1;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  @Column(name = "PriceLeg2", precision = 10, scale = 2)
  private BigDecimal priceLeg2;
}
