package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/** Response for returning HttpStatus codes/messages */
@Getter
@Setter
public class StatusResponse implements Response {
  private int status;
  private String statusText;

  // Error message
  @JsonInclude(JsonInclude.Include.NON_NULL)
  protected String message;

  // Any additional data
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private Object data;

  // Time of exception
  private final LocalDateTime timestamp;

  public StatusResponse(HttpStatus status) {
    this();
    this.status = status.value();
    this.statusText = status.getReasonPhrase();
  }

  public StatusResponse(HttpStatus status, String message) {
    this(status);
    this.message = message;
  }

  public StatusResponse() {
    this.timestamp = LocalDateTime.now(ZoneOffset.UTC);
  }

  public Response message(String message) {
    this.message = message;
    return this;
  }

  public Response data(Object data) {
    this.data = data;
    return this;
  }
}
