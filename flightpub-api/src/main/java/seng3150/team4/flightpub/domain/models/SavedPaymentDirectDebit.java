package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "SavedPayment_DirectDebit")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "SavedPaymentId")
public class SavedPaymentDirectDebit extends SavedPayment {

    @Column(name = "BSB")
    private String bsb;

    @Column(name = "AccountName")
    private String accountName;

    @Column(name = "AccountNumber")
    private String accountNumber;
}
