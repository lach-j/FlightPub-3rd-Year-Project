package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ResetToken implements IEntity {
  @Id String token;
  long userId;
  Date expiresAt;

  public ResetToken(String token, long userId, Date expiresAt) {
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
  }
}
