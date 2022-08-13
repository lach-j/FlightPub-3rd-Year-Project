package seng3150.team4.flightpub.domain.models;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "Payment")
@Entity
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
@JsonSubTypes({
  @JsonSubTypes.Type(PaymentDirectDebit.class),
  @JsonSubTypes.Type(PaymentCard.class),
  @JsonSubTypes.Type(PaymentPaypal.class)
})
public class Payment implements IEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "Id")
  private long Id;

  @Column(name = "Type")
  private PaymentType type;

  public enum PaymentType {
    DIRECT_DEBIT,
    CARD,
    PAYPAL
  }
}
