package seng3150.team4.flightpub.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import seng3150.team4.flightpub.security.SecurityFilter;
import seng3150.team4.flightpub.services.JwtHelperService;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

  private final JwtHelperService jwtHelper;

  @Bean
  SecurityFilter getSecurityFilter() {
    return new SecurityFilter(jwtHelper);
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(getSecurityFilter())
            .addPathPatterns("/users/**"); // TODO: add all necessary paths
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**");
    // TODO: map this to UI url endpoint
  }
}
