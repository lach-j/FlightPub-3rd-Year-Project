package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "MessagingSession")
public class MessagingSession implements IEntity {
  @Column(name = "Id")
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "Status")
  private SessionStatus status;

  @OneToOne
  @JoinColumn(name = "WishlistId")
  private Wishlist wishlist;

  @JsonManagedReference
  @ManyToMany
  @JoinTable(
      name = "MessagingSession_FPUser",
      joinColumns = @JoinColumn(name = "SessionId"),
      inverseJoinColumns = @JoinColumn(name = "UserId"))
  private Set<User> users;

  @JsonManagedReference
  @OneToMany(cascade = CascadeType.ALL)
  @JoinColumn(name = "SessionId", referencedColumnName = "Id")
  private List<Message> messages;

  public enum SessionStatus {
    TRIAGE,
    IN_PROGRESS,
    RESOLVED
  }
}
