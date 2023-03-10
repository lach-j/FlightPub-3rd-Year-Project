package seng3150.team4.flightpub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/** Application main class */
@SpringBootApplication
@ConfigurationPropertiesScan
public class FlightpubApplication {

  public static void main(String[] args) {
    SpringApplication.run(FlightpubApplication.class, args);
  }
}
