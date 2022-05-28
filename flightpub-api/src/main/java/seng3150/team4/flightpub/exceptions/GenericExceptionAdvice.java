package seng3150.team4.flightpub.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

@ControllerAdvice
public class GenericExceptionAdvice {
  @ResponseBody
  @ExceptionHandler(UnsupportedOperationException.class)
  @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
  Response entityAlreadyExistsHandler(UnsupportedOperationException ex) {
    return new StatusResponse(HttpStatus.NOT_IMPLEMENTED, ex.getMessage());
  }
}
