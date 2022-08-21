package seng3150.team4.flightpub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.MessageRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.Message;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.services.MessagingService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    var session = messagingService.getSessionByIdSecure(sessionId);
    return new EntityResponse<>(session);
  }

  @Authorized
  @GetMapping
  public EntityCollectionResponse<MessagingSession> getAllSessions() {
    return new EntityCollectionResponse<>(messagingService.getAllSessions());
  }

  @Authorized
  @PatchMapping("/{sessionId}")
  public StatusResponse addMessage(
      @PathVariable long sessionId, @RequestBody MessageRequest message) {
    message.validate();
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
  public EntityResponse<MessagingSession> joinSession(@PathVariable long sessionId) {
    return new EntityResponse<>(messagingService.addCurrentUserToSession(sessionId));
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR, UserRole.TRAVEL_AGENT})
  @PatchMapping("/{sessionId}/resolve")
  public StatusResponse resolveSession(@PathVariable long sessionId) {
    messagingService.resolveSession(sessionId);
    return new StatusResponse(HttpStatus.OK);
  }

  @Authorized(logResolution = false)
  @GetMapping("/{sessionId}/messages")
  public EntityCollectionResponse<Message> getMessagesSince(
      @PathVariable long sessionId, @RequestParam("since") String messagesSince) {

    LocalDateTime date = DateTimeFormatter.ISO_DATE_TIME.parse(messagesSince, LocalDateTime::from);
    var messages = messagingService.getLatestMessages(sessionId, date);

    return new EntityCollectionResponse<>(messages);
  }
}
