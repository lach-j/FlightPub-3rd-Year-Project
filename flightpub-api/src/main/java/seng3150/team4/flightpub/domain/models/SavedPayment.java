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
@Inheritance(strategy = InheritanceType.JOINED)
public class SavedPayment implements IEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "Id")
  private long Id;

  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "UserId")
  private User user;

  @Column(name = "Nickname")
  private String nickname;

  @Column(name = "Type")
  private PaymentType type;

  private enum PaymentType {
    DIRECT_DEBIT,
    CARD,
    PAYPAL
  }
}
