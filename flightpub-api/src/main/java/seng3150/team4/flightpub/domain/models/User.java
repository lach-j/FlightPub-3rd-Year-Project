package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * Models the user table of the database representing the user data of a registered user
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
public class User implements IEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(unique = true)
  private String email;

  private String firstName;
  private String lastName;
  private String password;

  // TODO: add saved payments and other user data to model
}
