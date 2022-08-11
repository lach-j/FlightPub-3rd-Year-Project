package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

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
