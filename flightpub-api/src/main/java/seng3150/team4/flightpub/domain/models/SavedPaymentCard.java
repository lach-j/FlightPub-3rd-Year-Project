package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "SavedPayment_Card")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "SavedPaymentId")
public class SavedPaymentCard extends SavedPayment {

    @Column(name = "CardNumber")
    private String cardNumber;

    @Column(name = "ExpiryDate")
    private String expiryDate;

    @Column(name = "Cardholder")
    private String cardholder;

    @Column(name = "CCV")
    private String ccv;
}
