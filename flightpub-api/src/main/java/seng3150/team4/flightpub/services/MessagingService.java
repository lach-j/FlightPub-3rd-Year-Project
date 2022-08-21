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

  /**
   * Checks if the user is in the session or if the user is an administrator to determine whether
   * they are allowed to access the session data.
   */
  private boolean currentUserCanAccessSession(MessagingSession session) {
    var userId = currentUserContext.getCurrentUserId();
    var userRole = currentUserContext.getCurrentUserRole();
    var userInSession = session.getUsers().stream().anyMatch(u -> u.getId() == userId);
    var userIsAdmin = userRole == UserRole.ADMINISTRATOR;

    return (userInSession || userIsAdmin);
  }

  /**
   * Checks if the current user is able to join the session by checking if they either a travel agent or admin
   */
  private boolean currentUserCanJoinSession() {
    var userRole = currentUserContext.getCurrentUserRole();
    return userRole == UserRole.ADMINISTRATOR || userRole == UserRole.TRAVEL_AGENT;
  }

  /**
   * Gets the session by ID ensuring that the user is allowed to access the session. This method should be used when
   * fetching session data to return to a user.
   */
  public MessagingSession getSessionByIdSecure(long sessionId) {
    var session = messagingRepository.findById(sessionId);

    if (session.isEmpty())
      throw new EntityNotFoundException(
          String.format("Session with id %d does not exist.", sessionId));

    var found = session.get();

    if (!currentUserCanAccessSession(found))
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "User not authorized to access this session");

    return found;
  }

  /**
   * Gets the session by ID without checking permissions. This method should only be used internally to fetch session
   * data.
   */
  public MessagingSession getSessionById(long sessionId) {
    var session = messagingRepository.findById(sessionId);

    if (session.isEmpty())
      throw new EntityNotFoundException(
          String.format("Session with id %d does not exist.", sessionId));

    var found = session.get();

    if (!currentUserCanJoinSession())
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "User not authorized to access this session");

    return found;
  }

  /**
   * Gets all messages from a session that occurred after a certain time. This methods primary use is for fixed
   * interval polling in the messaging system.
   */
  public List<Message> getLatestMessages(long sessionId, LocalDateTime messagesSince) {
    var session = getSessionByIdSecure(sessionId);
    return session.getMessages().stream()
        .filter(m -> m.getDateSent().isAfter(messagesSince))
        .collect(Collectors.toList());
  }

  /**
   * Retrieves and returns all messaging sessions that the user is allowed to see.
   */
  public List<MessagingSession> getAllSessions() {
    var role = currentUserContext.getCurrentUserRole();
    var user = resolveCurrentUser();

    switch (role) {
      case STANDARD_USER:
        // Returns only the sessions the user is part of
        return messagingRepository.getAllSessionsForUser(user);
      case TRAVEL_AGENT:
        // Returns the sessions the user is part of plus any sessions in TRIAGE
        return messagingRepository.getAllSessionsForAgent(user);
      case ADMINISTRATOR:
        // Returns all sessions
        return messagingRepository.getAllSessionsForAdmin();
      default:
        throw new UnsupportedOperationException("This user role is not supported");
    }
  }

  /**
   * Transitions the sessions status to the RESOLVED SessionStatus.
   */
  public void resolveSession(long sessionId) {
    var session = getSessionByIdSecure(sessionId);
    session.setStatus(MessagingSession.SessionStatus.RESOLVED);
    messagingRepository.save(session);
  }

  private MessagingSession createSessionObj() {
    var session = new MessagingSession();

    session.setUsers(Set.of(resolveCurrentUser()));
    session.setStatus(MessagingSession.SessionStatus.TRIAGE);
    return session;
  }

  /**
   * Creates and saves an empty session containing the current user.
   */
  public MessagingSession createSession() {
    var session = createSessionObj();
    return messagingRepository.save(session);
  }

  /**
   * Creates and saved a session containing the current user and links it to their wishlist.
   */
  public MessagingSession createSession(Wishlist wishlist) {
    var session = createSessionObj();
    session.setWishlist(wishlist);
    return messagingRepository.save(session);
  }

  /**
   * Creates a new message containing the provided message with the current time and user and adds it to a session.
   */
  public void addMessageToSession(long sessionId, String message) {
    var session = getSessionByIdSecure(sessionId);

    // Splits the messages into chunks of 255 characters in order to store them in the database.
    var messages = message.split("(?<=\\G.{" + 255 + "})");
    for (var msg : messages) {
      var messageEntity = new Message();
      messageEntity.setContent(msg);
      messageEntity.setSession(session);
      messageEntity.setDateSent(LocalDateTime.now(ZoneOffset.UTC));
      messageEntity.setUser(resolveCurrentUser());

      session.getMessages().add(messageEntity);
    }

    messagingRepository.save(session);
  }

  /**
   * Adds a user to a session allowing them to access the sessions messages.
   */
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
