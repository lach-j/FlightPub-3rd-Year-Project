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

    public String getApiUrl() {
        var scheme = ApiSsl ? "https" : "http";

        return UriComponentsBuilder
                .newInstance()
                .scheme(scheme)
                .host(ApiHost)
                .port(ApiPort)
                .build()
                .toUriString();
    }

    public String getUiUrl() {
        return null;
    }

}
