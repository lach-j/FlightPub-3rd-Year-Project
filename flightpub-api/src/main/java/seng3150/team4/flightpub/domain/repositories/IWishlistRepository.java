package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.models.Wishlist;

import java.util.Set;

public interface IWishlistRepository extends CrudRepository<Wishlist, Long> {

  @Query("SELECT w from Wishlist w join w.user u WHERE u = ?1")
  Set<Wishlist> getWishlistsForUser(User user);
}
