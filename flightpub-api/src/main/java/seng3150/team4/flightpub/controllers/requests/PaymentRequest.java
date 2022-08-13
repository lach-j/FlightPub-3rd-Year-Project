package seng3150.team4.flightpub.controllers.requests;

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
public class PaymentRequest extends Validatable implements IPaymentRequest {
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
    if (isNullOrEmpty(nickname))
      result.addError(new ValidationError("nickname").addError(ErrorConstants.REQUIRED));

    if (type == Payment.PaymentType.DIRECT_DEBIT) {
      if (isNullOrEmpty(bsb))
        result.addError(new ValidationError("bsb").addError(ErrorConstants.REQUIRED));
      if (isNullOrEmpty(accountName))
        result.addError(new ValidationError("accountName").addError(ErrorConstants.REQUIRED));
      if (isNullOrEmpty(accountNumber))
        result.addError(new ValidationError("accountNumber").addError(ErrorConstants.REQUIRED));
    }

    if (type == Payment.PaymentType.CARD) {
      if (isNullOrEmpty(cardNumber))
        result.addError(new ValidationError("cardNumber").addError(ErrorConstants.REQUIRED));
      if (isNullOrEmpty(expiryDate))
        result.addError(new ValidationError("expiryDate").addError(ErrorConstants.REQUIRED));
      if (isNullOrEmpty(cardholder))
        result.addError(new ValidationError("cardholder").addError(ErrorConstants.REQUIRED));
      if (isNullOrEmpty(cardholder))
        result.addError(new ValidationError("ccv").addError(ErrorConstants.REQUIRED));
    }

    if (type == Payment.PaymentType.PAYPAL) {
      if (isNullOrEmpty(email))
        result.addError(new ValidationError("email").addError(ErrorConstants.REQUIRED));
    }

    return result;
  }
}
