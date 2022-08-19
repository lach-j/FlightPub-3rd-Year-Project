package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class PriceId implements Serializable {
  private static final long serialVersionUID = -4559593586045662042L;

  private Long flightId;

  private String ticketClass;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    PriceId entity = (PriceId) o;
    return Objects.equals(this.ticketClass, entity.ticketClass)
        && Objects.equals(this.flightId, entity.flightId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(ticketClass, flightId);
  }
}
