package seng3150.team4.flightpub.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import seng3150.team4.flightpub.services.JwtHelperService;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;


public class SecurityFilter implements HandlerInterceptor {

    public final Logger LOG = LoggerFactory.getLogger(SecurityFilter.class);

    private final JwtHelperService jwtHelperService;

    public SecurityFilter(JwtHelperService jwtHelperService){
        this.jwtHelperService = jwtHelperService;
    }


    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) {
        String path = request.getRequestURI().substring(request.getContextPath().length()).replaceAll("[/]+$", "");
        var method = request.getMethod();

        String token = null;

        var cookies = Arrays.stream(ifNullDefault(request.getCookies(), new Cookie[]{}));
        var authCookie = cookies.filter(c -> c.getName().equals("bearer-token")).findFirst();
        if (authCookie.isPresent()) {
            token = authCookie.get().getValue();
        }

        var authHeader = request.getHeader("Authorization");
        if (!(authHeader == null) && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
        }
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "The provided token is invalid or has expired");
        }
        try {
            var jwt = jwtHelperService.verifyToken(token);
            var userId = jwt.getClaim("id").asLong();

            LOG.info("User with id {} approved to access restricted path {} [{}]", userId, path, method);
        } catch (JWTVerificationException exception) {
            LOG.info("Client {} attempted to access restricted route \"{}\" [{}]", request.getRemoteAddr() + ":" + request.getRemotePort(), path, method);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "The provided token is invalid or has expired");
        }
        return true;
    }

    private static <T> T ifNullDefault(T in, T def) {
        if (in == null) {
            return def;
        }
        return in;
    }
}