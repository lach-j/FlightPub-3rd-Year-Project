package seng3150.team4.flightpub.core.validation;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import seng3150.team4.flightpub.controllers.responses.InvalidObjectResponse;
import seng3150.team4.flightpub.controllers.responses.Response;

/** Handles InvalidObjectException being thrown and returns a "Bad Request" response to client. */
@ControllerAdvice
public class InvalidObjectAdvice {
  @ResponseBody
  @ExceptionHandler(InvalidObjectException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  Response requestNotValidHandler(InvalidObjectException ex) {
    return new InvalidObjectResponse(ex.getResult(), ex.getMessage());
  }
}
