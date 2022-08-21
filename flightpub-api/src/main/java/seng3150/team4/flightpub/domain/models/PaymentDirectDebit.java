package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Payment_DirectDebit")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "PaymentId")
public class PaymentDirectDebit extends Payment {

  @Column(name = "BSB")
  private String bsb;

  @Column(name = "AccountName")
  private String accountName;

  @Column(name = "AccountNumber")
  private String accountNumber;
}
