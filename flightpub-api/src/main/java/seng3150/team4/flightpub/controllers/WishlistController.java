package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.WishlistRequest;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.domain.models.Wishlist;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.services.IWishlistService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wishlist")
public class WishlistController {

  private final IWishlistService wishlistService;

  @Authorized(allowedRoles = UserRole.STANDARD_USER)
  @PostMapping
  public EntityResponse<Wishlist> createWishlist(@RequestBody WishlistRequest request) {
    request.validate();

    var wishlist =
        wishlistService.createWishlist(request.getDepartureCode(), request.getDestinations());

    return new EntityResponse<>(wishlist);
  }
}
