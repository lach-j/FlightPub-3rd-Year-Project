package seng3150.team4.flightpub.utility;

import org.apache.commons.codec.binary.Base64;

import java.security.SecureRandom;

public class TokenGenerator {
    public static String generate(int length) {
        SecureRandom random = new SecureRandom();
        byte[] r = new byte[length];
        random.nextBytes(r);
        return Base64.encodeBase64String(r);
    }
}
