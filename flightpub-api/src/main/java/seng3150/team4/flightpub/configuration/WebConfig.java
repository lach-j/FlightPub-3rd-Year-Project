package seng3150.team4.flightpub.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.security.SecurityFilter;
import seng3150.team4.flightpub.services.JwtHelperService;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

  private final JwtHelperService jwtHelper;
  private final CurrentUserContext currentUserContext;

  @Bean
  SecurityFilter getSecurityFilter() {
    return new SecurityFilter(jwtHelper, currentUserContext);
  }

  // Add the security interceptor to all incoming requests
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(getSecurityFilter()).addPathPatterns("/**");
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**").allowedMethods("*");
    // TODO: map this to UI url endpoint
  }
}
