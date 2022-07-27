package seng3150.team4.flightpub.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.domain.models.Message;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.domain.repositories.IMessagingRepository;
import seng3150.team4.flightpub.security.CurrentUserContext;
import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class MessagingService {

  private final IMessagingRepository messagingRepository;
  private final CurrentUserContext currentUserContext;
  private final UserService userService;

  public MessagingService(
      IMessagingRepository messagingRepository,
      CurrentUserContext currentUserContext,
      UserService userService) {
    this.messagingRepository = messagingRepository;
    this.currentUserContext = currentUserContext;
    this.userService = userService;
  }

  public MessagingSession getSessionById(long sessionId) {
    var session = messagingRepository.findById(sessionId);

    if (session.isEmpty())
      throw new EntityNotFoundException(
          String.format("Session with id %d does not exist.", sessionId));

    return session.get();
  }

  public MessagingSession createSession(Set<Long> userIds) {
    var session = new MessagingSession();

    var users = userService.getUsersById(userIds);
    session.setUsers(new HashSet<>(users));

    var saved = messagingRepository.save(session);
    return saved;
  }

  public void addMessageToSession(long sessionId, String message) {
    var session = getSessionById(sessionId);
    var userId = currentUserContext.getCurrentUserId();
    var user = userService.getUserById(userId);

    if (session.getUsers().stream().noneMatch(u -> u.getId() == userId))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to access this session");

    var messageEntity = new Message();
    messageEntity.setContent(message);
    messageEntity.setSession(session);
    messageEntity.setDateSent(LocalDateTime.now());
    messageEntity.setUser(user);

    session.getMessages().add(messageEntity);

    messagingRepository.save(session);
  }
}
