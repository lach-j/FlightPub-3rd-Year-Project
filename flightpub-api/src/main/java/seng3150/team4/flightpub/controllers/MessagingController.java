package seng3150.team4.flightpub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.MessageRequest;
import seng3150.team4.flightpub.controllers.requests.SessionRequest;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.services.MessagingService;

@RestController
@RequestMapping(path = "messages")
public class MessagingController {

  private final MessagingService messagingService;

  public MessagingController(MessagingService messagingService) {
    this.messagingService = messagingService;
  }

  @GetMapping("/{sessionId}")
  public EntityResponse<MessagingSession> getSession(@PathVariable long sessionId) {
    var session = messagingService.getSessionById(sessionId);
    return new EntityResponse<>(session);
  }

  @PostMapping("/{sessionId}")
  public StatusResponse addMessage(
      @PathVariable long sessionId, @RequestBody MessageRequest message) {
    messagingService.addMessageToSession(sessionId, message.getContent());

    return new StatusResponse(HttpStatus.ACCEPTED);
  }

  @PostMapping
  public EntityResponse<MessagingSession> createSession(@RequestBody SessionRequest request) {
    request.validate();

    var session = messagingService.createSession(request.getUserIds());
    return new EntityResponse<>(session);
  }
}
