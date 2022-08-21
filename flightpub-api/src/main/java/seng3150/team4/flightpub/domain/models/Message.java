package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Message")
public class Message implements IEntity {

  @JsonBackReference
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "SessionId", nullable = false)
  private MessagingSession session;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "Id")
  private long id;

  @Column(name = "dateSent")
  private LocalDateTime dateSent;

  @Column(name = "Content")
  private String content;

  @JoinColumn(name = "UserId")
  @ManyToOne
  User user;
}
