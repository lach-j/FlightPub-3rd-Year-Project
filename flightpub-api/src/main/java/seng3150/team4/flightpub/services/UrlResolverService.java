package seng3150.team4.flightpub.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class UrlResolverService implements IUrlResolverService {

  @Value("${flightpub.url.api.ssl}")
  private boolean ApiSsl;

  @Value("${flightpub.url.api.host}")
  private String ApiHost;

  @Value("${flightpub.url.api.port}")
  private String ApiPort;

  @Value("${flightpub.url.ui.ssl}")
  private boolean UiSsl;

  @Value("${flightpub.url.ui.host}")
  private String UiHost;

  @Value("${flightpub.url.ui.port}")
  private String UiPort;

  public String getApiUrl() {
    var scheme = ApiSsl ? "https" : "http";

    return UriComponentsBuilder.newInstance()
        .scheme(scheme)
        .host(ApiHost)
        .port(ApiPort)
        .build()
        .toUriString();
  }

  public String getUiUrl() {
    var scheme = UiSsl ? "https" : "http";

    return UriComponentsBuilder.newInstance()
        .scheme(scheme)
        .host(UiHost)
        .port(UiPort)
        .build()
        .toUriString();
  }
}
