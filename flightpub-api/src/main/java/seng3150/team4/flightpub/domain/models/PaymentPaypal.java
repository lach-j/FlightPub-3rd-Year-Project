package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Payment_Paypal")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "PaymentId")
public class PaymentPaypal extends Payment {

  @Column(name = "Email")
  private String email;
}
