package seng3150.team4.flightpub.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "flightpub")
public class ApplicationProperties {
    public static class Url {
        @Getter
        @Setter
        public static class Api {
            private boolean ssl;
            private String host;
            private int port;
        }
        public static class Ui {
            private boolean ssl;
            private String host;
            private int port;
        }
    }

    @Getter
    @Setter
    public static class Email {
        private String SENDGRID_API_KEY;
        private String support_email;
        private boolean ENABLED;
    }

}
