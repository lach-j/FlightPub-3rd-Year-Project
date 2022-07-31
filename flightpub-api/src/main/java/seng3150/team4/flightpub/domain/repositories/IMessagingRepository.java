package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.domain.models.User;

import java.util.List;
import java.util.Optional;

/** Repository for making CRUD transactions on the User database table. */
public interface IMessagingRepository extends JpaRepository<MessagingSession, Long> {

    @Query("select m from MessagingSession m join m.users u where u = ?1 OR m.status = seng3150.team4.flightpub.domain.models.MessagingSession$SessionStatus.TRIAGE")
    List<MessagingSession> getAllSessionsForAgent(User user);

    @Query("select m from MessagingSession m inner join User u where u = ?1")
    List<MessagingSession> getAllSessionsForUser(User user);
}