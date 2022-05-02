package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.User;

import java.util.Optional;

public interface IUserRepository extends CrudRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    public Optional<User> findByEmail(String email);
}