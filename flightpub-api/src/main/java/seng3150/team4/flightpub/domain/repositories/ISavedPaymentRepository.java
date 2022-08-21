package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.SavedPayment;

public interface ISavedPaymentRepository extends CrudRepository<SavedPayment, Long> {}
