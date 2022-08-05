package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.repositories.IMessagingRepository;
import seng3150.team4.flightpub.security.CurrentUserContext;
import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessagingService {

  private final IMessagingRepository messagingRepository;
  private final CurrentUserContext currentUserContext;
  private final UserService userService;

  private boolean currentUserCanAccessSession(MessagingSession session) {
    var userId = currentUserContext.getCurrentUserId();
    var userRole = currentUserContext.getCurrentUserRole();
    var userInSession = session.getUsers().stream().anyMatch(u -> u.getId() == userId);
    var userIsStaff = (userRole == UserRole.ADMINISTRATOR || userRole == UserRole.TRAVEL_AGENT);

    return (userInSession || userIsStaff);
  }

  public MessagingSession getSessionById(long sessionId) {
    var session = messagingRepository.findById(sessionId);

    if (session.isEmpty())
      throw new EntityNotFoundException(
          String.format("Session with id %d does not exist.", sessionId));

    var found = session.get();

    if (!currentUserCanAccessSession(found))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to access this session");

    return found;
  }

  public List<Message> getLatestMessages(long sessionId, LocalDateTime messagesSince) {
      var session = getSessionById(sessionId);
      return session.getMessages().stream().filter(m -> m.getDateSent().isAfter(messagesSince)).collect(Collectors.toList());
  }

  public List<MessagingSession> getAllSessions() {
    var role = currentUserContext.getCurrentUserRole();
    var user = resolveCurrentUser();

    switch (role) {
      case STANDARD_USER:
        return messagingRepository.getAllSessionsForUser(user);
      case TRAVEL_AGENT:
        return messagingRepository.getAllSessionsForAgent(user);
      case ADMINISTRATOR:
        return messagingRepository.getAllSessionsForAdmin();
      default:
        throw new UnsupportedOperationException("This user role is not supported");
    }
  }

  private MessagingSession createSessionObj() {
    var session = new MessagingSession();

    session.setUsers(Set.of(resolveCurrentUser()));
    session.setStatus(MessagingSession.SessionStatus.TRIAGE);
    return session;
  }

  public MessagingSession createSession() {
    var session = createSessionObj();
    return messagingRepository.save(session);
  }

  public MessagingSession createSession(Wishlist wishlist) {
    var session = createSessionObj();
    session.setWishlist(wishlist);
    return messagingRepository.save(session);
  }

  public void addMessageToSession(long sessionId, String message) {
    var session = getSessionById(sessionId);

    var messageEntity = new Message();
    messageEntity.setContent(message);
    messageEntity.setSession(session);
    messageEntity.setDateSent(LocalDateTime.now(ZoneOffset.UTC));
    messageEntity.setUser(resolveCurrentUser());

    session.getMessages().add(messageEntity);

    messagingRepository.save(session);
  }

  public MessagingSession addCurrentUserToSession(long sessionId) {
    var session = getSessionById(sessionId);

    session.getUsers().add(resolveCurrentUser());
    session.setStatus(MessagingSession.SessionStatus.IN_PROGRESS);

    return messagingRepository.save(session);
  }

  private User resolveCurrentUser() {
    var userId = currentUserContext.getCurrentUserId();
    return userService.getUserByIdSecure(userId);
  }
}
