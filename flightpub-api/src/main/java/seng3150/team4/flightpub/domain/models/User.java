package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

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

  @JsonIgnore
  @Column(name = "Password")
  private String password;

  @ManyToMany
  @JoinTable(name="MessagingSession_FPUser",
          joinColumns=@JoinColumn(name="UserId"),
          inverseJoinColumns=@JoinColumn(name="SessionId")
  )
  private Set<MessagingSession> sessions;
  private UserRole role;

  // TODO: add saved payments and other user data to model
}
