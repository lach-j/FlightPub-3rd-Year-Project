package seng3150.team4.flightpub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

@RestController
@RequestMapping("/")
public class HomeController {

  @GetMapping
  public Response Get() {
    return new StatusResponse(HttpStatus.OK, "Hello World!");
  }
}
