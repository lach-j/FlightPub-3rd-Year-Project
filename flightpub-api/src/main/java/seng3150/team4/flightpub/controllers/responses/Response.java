package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Getter
@ResponseStatus
public class Response {
    private int status;
    private String statusText;
    @JsonInclude(Include.NON_NULL)
    private String message;
    @JsonInclude(Include.NON_NULL)
    private Object data;
    private final LocalDateTime timestamp;

    public Response(HttpStatus status) {
        this();
        this.status = status.value();
        this.statusText = status.getReasonPhrase();
    }

    public Response() {
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
