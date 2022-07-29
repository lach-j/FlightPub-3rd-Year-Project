package seng3150.team4.flightpub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.MessageRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.services.MessagingService;

@RestController
@RequestMapping(path = "messages")
public class MessagingController {

  private final MessagingService messagingService;

  public MessagingController(MessagingService messagingService) {
    this.messagingService = messagingService;
  }

  @Authorized
  @GetMapping("/{sessionId}")
  public EntityResponse<MessagingSession> getSession(@PathVariable long sessionId) {
    var session = messagingService.getSessionById(sessionId);
    return new EntityResponse<>(session);
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR})
  @GetMapping
  public EntityCollectionResponse<MessagingSession> getAllSessions() {
    return new EntityCollectionResponse<>(messagingService.getAllSessions());
  }

  @Authorized
  @PatchMapping("/{sessionId}")
  public StatusResponse addMessage(
      @PathVariable long sessionId, @RequestBody MessageRequest message) {
    messagingService.addMessageToSession(sessionId, message.getContent());

    return new StatusResponse(HttpStatus.ACCEPTED);
  }

  @Authorized
  @PostMapping
  public EntityResponse<MessagingSession> createSession() {
    var session = messagingService.createSession();
    return new EntityResponse<>(session);
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR, UserRole.TRAVEL_AGENT})
  @PatchMapping("/{sessionId}/join")
  public EntityResponse<MessagingSession> joinSession(@PathVariable long sessionId)
  {
    return new EntityResponse<>(messagingService.addCurrentUserToSession(sessionId));
  }
}
