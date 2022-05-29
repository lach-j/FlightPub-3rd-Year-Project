package seng3150.team4.flightpub.utility;

import org.apache.commons.codec.binary.Base64;

import java.security.SecureRandom;

/** Utility class used to generate random Base64 encoded tokens */
public class TokenGenerator {
  public static String generate(int length) {
    SecureRandom random = new SecureRandom();
    byte[] r = new byte[length]; // Create a byte array of size 'length'
    random.nextBytes(r); // Fill with random bytes
    return Base64.encodeBase64String(r); // Encode to Base64
  }
}
