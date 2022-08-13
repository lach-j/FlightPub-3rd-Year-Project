package seng3150.team4.flightpub.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.core.validation.ErrorConstants;
import seng3150.team4.flightpub.core.validation.Validatable;
import seng3150.team4.flightpub.core.validation.ValidationError;
import seng3150.team4.flightpub.core.validation.ValidationResult;
import seng3150.team4.flightpub.domain.models.Payment;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentRequest extends Validatable implements IPaymentRequest {
  private Payment.PaymentType type;
  private String nickname;

  private String bsb;
  private String accountName;
  private String accountNumber;

  private String cardNumber;
  private String expiryDate;
  private String cardholder;
  private String ccv;

  private String email;

  @Override
  protected ValidationResult getErrors() {
    var result = new ValidationResult();

    if (isNullOrEmpty(type))
      result.addError(new ValidationError("type").addError(ErrorConstants.REQUIRED));

    return result;
  }
}
