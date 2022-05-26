package seng3150.team4.flightpub;

import org.hibernate.Hibernate;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PriceId implements Serializable {
    private static final long serialVersionUID = -4559593586045662042L;
    @Column(name = "FlightId", nullable = false)
    private Long flightId;

    @Column(name = "ClassCode", nullable = false, length = 3)
    private String classCode;

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PriceId entity = (PriceId) o;
        return Objects.equals(this.classCode, entity.classCode) &&
                Objects.equals(this.flightId, entity.flightId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(classCode, flightId);
    }

}