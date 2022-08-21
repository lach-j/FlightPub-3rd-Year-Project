package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Destination;
import seng3150.team4.flightpub.domain.models.Wishlist;
import seng3150.team4.flightpub.domain.models.WishlistItem;
import seng3150.team4.flightpub.domain.repositories.IDestinationRepository;
import seng3150.team4.flightpub.domain.repositories.IWishlistItemRepository;
import seng3150.team4.flightpub.domain.repositories.IWishlistRepository;
import seng3150.team4.flightpub.security.CurrentUserContext;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WishlistService implements IWishlistService {

  private final IWishlistRepository wishlistRepository;
  private final IWishlistItemRepository wishlistItemRepository;
  private final IUserService userService;
  private final CurrentUserContext currentUserContext;
  private final IDestinationRepository destinationRepository;
  private final MessagingService messagingService;

  @Override
  public Set<Wishlist> getWishlistForUser(long userId) {
    var user = userService.getUserByIdSecure(userId);
    return wishlistRepository.getWishlistsForUser(user);
  }

  @Override
  public Wishlist getWishlistById(long wishlistId) {
    var wishlist = wishlistRepository.findById(wishlistId);

    if (wishlist.isEmpty())
      throw new EntityNotFoundException(
          String.format("A wishlist with id %d was not found.", wishlistId));

    return wishlist.get();
  }

  @Override
  public Wishlist createWishlist(String departureCode, List<String> destinationCodes) {
    var user = userService.getUserByIdSecure(currentUserContext.getCurrentUserId());

    var wishlist = new Wishlist();

    wishlist.setUser(user);

    var departureLocation = destinationRepository.findById(departureCode);

    if (departureLocation.isEmpty())
      throw new EntityNotFoundException(
          String.format("Destination with id %s not found.", departureCode));

    wishlist.setDepartureLocation(departureLocation.get());
    wishlist.setDateCreated(LocalDateTime.now(ZoneOffset.UTC));

    var wishlistSaved = wishlistRepository.save(wishlist);

    // This isn't ideas as it requires querying in a loop, however it
    // is the quick way of ensuring the destinations stay in order.
    var destinations = new ArrayList<Destination>();
    for (var destinationCode : destinationCodes) {
      var dest = destinationRepository.findById(destinationCode);
      dest.ifPresent(destinations::add);
    }

    Set<WishlistItem> wishlistItems = new HashSet<>();
    var index = 1;
    for (var destination : destinations) {
      var item = new WishlistItem(null, destination, wishlistSaved, index++);
      wishlistItems.add(item);
    }
    wishlistItemRepository.saveAll(wishlistItems);
    wishlist.setWishlistItems(wishlistItems);

    messagingService.createSession(wishlistSaved);

    return wishlistRepository.save(wishlist);
  }
}
