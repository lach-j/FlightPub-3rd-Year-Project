package seng3150.team4.flightpub.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

@ControllerAdvice
public class StatusExceptionAdvice {
  @ResponseBody
  @ExceptionHandler(ResponseStatusException.class)
  ResponseEntity<Response> responseStatusExceptionAdvice(ResponseStatusException ex) {
    return new ResponseEntity<>(
        new StatusResponse(ex.getStatus(), ex.getLocalizedMessage()), ex.getStatus());
  }
}

// TODO: implement specific ControllerAdvice for exceptions rather than throwing
// ResponseStatusExceptions
// as this tightly couples the API layer to the rest of the application
