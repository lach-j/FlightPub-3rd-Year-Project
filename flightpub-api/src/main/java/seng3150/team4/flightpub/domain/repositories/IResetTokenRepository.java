package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import seng3150.team4.flightpub.domain.models.ResetToken;

/** Repository for making CRUD transactions on the ResetToken database table. */
public interface IResetTokenRepository extends CrudRepository<ResetToken, String> {
  @Transactional
  @Modifying
  @Query("DELETE FROM ResetToken rt WHERE rt.userId = ?1")
  void removeTokensByUser(long userId);
}
