package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

/**
 * Models the ResetToken table in the database for holding password reset tokens used to reset
 * forgotten passwords
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ResetToken implements IEntity {
  @Id String token;
  long userId;
  Date expiresAt; // Date that the token expires at to ensure that the token remains fresh

  public ResetToken(String token, long userId, Date expiresAt) {
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
  }
}
