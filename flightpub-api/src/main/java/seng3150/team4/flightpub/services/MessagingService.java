package seng3150.team4.flightpub.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.domain.models.Message;
import seng3150.team4.flightpub.domain.models.MessagingSession;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.models.UserRole;
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

  private boolean userCanAccessSession(long userId, MessagingSession session) {
    var userRole = currentUserContext.getCurrentUserRole();
    var userInSession = session.getUsers().stream().noneMatch(u -> u.getId() == userId);
    var userIsStaff = (userRole == UserRole.ADMINISTRATOR || userRole == UserRole.TRAVEL_AGENT);

    return (userInSession || userIsStaff);
  }

  public MessagingSession getSessionById(long sessionId) {
    var userId = currentUserContext.getCurrentUserId();
    var session = messagingRepository.findById(sessionId);

    if (session.isEmpty())
      throw new EntityNotFoundException(
          String.format("Session with id %d does not exist.", sessionId));

    var found = session.get();

    if (!userCanAccessSession(userId, found))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to access this session");

    return found;
  }

  public MessagingSession createSession() {
    var session = new MessagingSession();

    session.setUsers(Set.of(resolveCurrentUser()));

    return messagingRepository.save(session);
  }

  public void addMessageToSession(long sessionId, String message) {
    var session = getSessionById(sessionId);

    var messageEntity = new Message();
    messageEntity.setContent(message);
    messageEntity.setSession(session);
    messageEntity.setDateSent(LocalDateTime.now());
    messageEntity.setUser(resolveCurrentUser());

    session.getMessages().add(messageEntity);

    messagingRepository.save(session);
  }

  public MessagingSession addCurrentUserToSession(long sessionId) {
    var session = getSessionById(sessionId);

    session.getUsers().add(resolveCurrentUser());

    return messagingRepository.save(session);
  }

  private User resolveCurrentUser() {
    var userId = currentUserContext.getCurrentUserId();
    return userService.getUserById(userId);
  }
}
