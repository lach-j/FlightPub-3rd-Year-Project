package seng3150.team4.flightpub.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

@ControllerAdvice
public class EntityExceptionAdvice {
  @ResponseBody
  @ExceptionHandler(EntityExistsException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  Response entityAlreadyExistsHandler(EntityExistsException ex) {
    return new StatusResponse(HttpStatus.CONFLICT, ex.getMessage());
  }

  @ResponseBody
  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  Response entityNotFoundHandler(EntityNotFoundException ex) {
    return new StatusResponse(HttpStatus.NOT_FOUND, ex.getMessage());
  }
}
