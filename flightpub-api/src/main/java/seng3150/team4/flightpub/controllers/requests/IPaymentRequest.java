package seng3150.team4.flightpub.controllers.requests;

import seng3150.team4.flightpub.domain.models.Payment;

public interface IPaymentRequest {

  Payment.PaymentType getType();

  void setType(Payment.PaymentType type);

  String getNickname();

  void setNickname(String nickname);

  String getBsb();

  void setBsb(String bsb);

  String getAccountName();

  void setAccountName(String accountName);

  String getAccountNumber();

  void setAccountNumber(String accountNumber);

  String getCardNumber();

  void setCardNumber(String cardNumber);

  String getExpiryDate();

  void setExpiryDate(String expiryDate);

  String getCardholder();

  void setCardholder(String cardholder);

  String getCcv();

  void setCcv(String ccv);

  String getEmail();

  void setEmail(String email);
}
