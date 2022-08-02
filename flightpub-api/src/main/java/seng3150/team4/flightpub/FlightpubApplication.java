package seng3150.team4.flightpub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/** Application main class */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableSwagger2
public class FlightpubApplication {
  public static void main(String[] args) {
    SpringApplication.run(FlightpubApplication.class, args);
  }
}
