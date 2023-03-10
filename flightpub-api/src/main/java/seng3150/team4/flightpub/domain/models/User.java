package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/** Models the user table of the database representing the user data of a registered user */
@Table(name = "FPUser")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class User implements IEntity {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(name = "Email", unique = true)
  private String email;

  @Column(name = "FirstName")
  private String firstName;

  @Column(name = "LastName")
  private String lastName;
  @Column(name = "Password")
  private String password;

  // TODO: add saved payments and other user data to model
}
