package seng3150.team4.flightpub.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.services.JwtHelperService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.stream.Collectors;

public class SecurityFilter implements HandlerInterceptor {

  public final Logger LOG = LoggerFactory.getLogger(SecurityFilter.class);

  private final JwtHelperService jwtHelperService;
  private final CurrentUserContext currentUserContext;

  public SecurityFilter(JwtHelperService jwtHelperService, CurrentUserContext currentUserContext) {
    this.jwtHelperService = jwtHelperService;
    this.currentUserContext = currentUserContext;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {

    if (!(handler instanceof HandlerMethod)) return true;

    HandlerMethod handlerMethod = (HandlerMethod) handler;

    Authorized classAnnotation =
        ((HandlerMethod) handler).getBeanType().getDeclaredAnnotation(Authorized.class);
    Authorized authAnnotation = handlerMethod.getMethod().getAnnotation(Authorized.class);

    if (authAnnotation == null && classAnnotation == null) {
      return true;
    }

    var logResult =
        authAnnotation != null ? authAnnotation.logResolution() : classAnnotation.logResolution();

    String path =
        request
            .getRequestURI()
            .substring(request.getContextPath().length())
            .replaceAll("[/]+$", "");

    var method = request.getMethod();

    String token = resolveTokenFromCookies(ifNullDefault(request.getCookies(), new Cookie[] {}));
    var authHeader = request.getHeader("Authorization");
    token = ifNullDefault(token, resolveTokenFromHeaders(authHeader));

    try {
      var jwt = jwtHelperService.verifyToken(ifNullDefault(token, ""));
      var userId = jwt.getClaim("id").asLong();
      var userRole = UserRole.valueOf(jwt.getClaim("role").asInt()).orElse(UserRole.STANDARD_USER);
      currentUserContext.setCurrentUserId(userId);
      currentUserContext.setCurrentUserRole(
          userRole); // set the user role if present, otherwise make them a standard user

      var allowedRoles =
          authAnnotation != null ? authAnnotation.allowedRoles() : classAnnotation.allowedRoles();

      if (Arrays.stream(allowedRoles).noneMatch(r -> r == userRole))
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            String.format(
                "The user does have a valid role. Allowed roles are: %s",
                Arrays.stream(allowedRoles).map(Enum::name).collect(Collectors.joining(", "))));
      if (logResult)
        LOG.info(
            "User with id {} approved to access restricted path \"{}\" [{}]", userId, path, method);
    } catch (JWTVerificationException exception) {
      if (logResult)
        LOG.info(
            "User with id {} denied access restricted route \"/{}\" [{}]",
            request.getRemoteAddr() + ":" + request.getRemotePort(),
            path,
            method);
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "The provided token is invalid or has expired");
    }
    return true;
  }

  private String resolveTokenFromCookies(Cookie[] requestCookies) {
    var cookies = Arrays.stream(requestCookies);
    var authCookie = cookies.filter(c -> c.getName().equals("bearer-token")).findFirst();
    return authCookie.map(Cookie::getValue).orElse(null);
  }

  private String resolveTokenFromHeaders(String authHeader) {
    if (authHeader == null) return null;

    if (authHeader.toLowerCase().startsWith("bearer ")) {
      return authHeader.replaceAll("(?i)bearer ", "");
    }
    return null;
  }

  private static <T> T ifNullDefault(T in, T def) {
    if (in == null) {
      return def;
    }
    return in;
  }
}
