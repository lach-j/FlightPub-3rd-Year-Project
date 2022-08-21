package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Payment;
import seng3150.team4.flightpub.domain.repositories.IPaymentRepository;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class PaymentService {

  private final IPaymentRepository paymentRepository;

  public Payment addPayment(Payment payment) {
    return paymentRepository.save(payment);
  }

  public Payment updatePayment(long paymentId, Payment payment) {
    var existing = paymentRepository.findById(paymentId);

    payment.setId(paymentId);

    if (existing.isPresent()) paymentRepository.save(payment);

    throw new EntityNotFoundException(String.format("Payment with id %d was not found", paymentId));
  }
}
