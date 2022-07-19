package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.User;

import java.util.Optional;

/** Repository for making CRUD transactions on the User database table. */
public interface IUserRepository extends CrudRepository<User, Long> {

  // Find the user in the database with the provided email address
  @Query("SELECT u FROM User u WHERE u.email = ?1")
  Optional<User> findByEmail(String email);
}
