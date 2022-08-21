package seng3150.team4.flightpub.security;

import seng3150.team4.flightpub.domain.models.UserRole;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to apply authorization to endpoint methods.
 *
 * allowedRoles - UserRoles that are allowed access to the endpoint (defaults to all roles).
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Authorized {
  UserRole[] allowedRoles() default {
    UserRole.STANDARD_USER, UserRole.TRAVEL_AGENT, UserRole.ADMINISTRATOR
  };

  boolean logResolution() default true;
}
