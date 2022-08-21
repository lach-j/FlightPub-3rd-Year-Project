package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Payment_Card")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "PaymentId")
public class PaymentCard extends Payment {

  @Column(name = "CardNumber")
  private String cardNumber;

  @Column(name = "ExpiryDate")
  private String expiryDate;

  @Column(name = "Cardholder")
  private String cardholder;

  @Column(name = "CCV")
  private String ccv;
}
