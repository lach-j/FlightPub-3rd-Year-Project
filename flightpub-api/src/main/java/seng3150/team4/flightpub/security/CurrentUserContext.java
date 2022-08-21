package seng3150.team4.flightpub.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import seng3150.team4.flightpub.domain.models.UserRole;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Getter
@Setter
public class CurrentUserContext {
  private Long currentUserId;
  private UserRole currentUserRole;
}
