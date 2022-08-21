package seng3150.team4.flightpub.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Resolves the API and UI URLs based on the configuration file Used for generating JWTs and
 * password reset links allowing easy deployment on both localhost and custom domains
 */
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
    return buildUriString(ApiSsl, ApiHost, ApiPort);
  }

  public String getUiUrl() {
    return buildUriString(UiSsl, UiHost, UiPort);
  }

  private static String buildUriString(boolean isSsl, String host, String port) {
    var scheme = isSsl ? "https" : "http";

    var uri = UriComponentsBuilder.newInstance().scheme(scheme).host(host);

    if (!port.equals("80")) uri.port(port);

    return uri.build().toUriString();
  }
}
