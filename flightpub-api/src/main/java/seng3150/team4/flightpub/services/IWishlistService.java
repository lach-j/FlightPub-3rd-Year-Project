package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Wishlist;

import java.util.List;
import java.util.Set;

public interface IWishlistService {
    Set<Wishlist> getWishlistForUser(long userId);
    Wishlist getWishlistById(long wishlistId);
    Wishlist createWishlist(List<String> destinationCodes);
}
