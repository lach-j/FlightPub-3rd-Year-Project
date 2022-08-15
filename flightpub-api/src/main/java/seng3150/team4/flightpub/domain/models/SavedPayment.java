package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "SavedPayment")
@Getter
@Setter
@NoArgsConstructor
public class SavedPayment implements IEntity {

  @Id
  @Column(name = "Id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "UserId")
  private User user;

  @Column(name = "Nickname")
  private String nickname;

  @JoinColumn(name = "PaymentId")
  @OneToOne
  private Payment payment;
}
