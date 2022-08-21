package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Wishlist;

import java.util.List;
import java.util.Set;

public interface IWishlistService {
  Set<Wishlist> getWishlistForUser(long userId);

  Wishlist getWishlistById(long wishlistId);

  /**
   * Creates a new wishlist for the current user with the provided destinations ensuring their rankings stay the same.
   */
  Wishlist createWishlist(String departureCode, List<String> destinationCodes);
}
