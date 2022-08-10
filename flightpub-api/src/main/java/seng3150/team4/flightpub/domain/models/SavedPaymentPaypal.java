package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "SavedPayment_Paypal")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "SavedPaymentId")
public class SavedPaymentPaypal extends SavedPayment {

    @Column(name = "Email")
    private String email;
}
