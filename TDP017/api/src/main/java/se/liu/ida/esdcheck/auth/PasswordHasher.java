package se.liu.ida.esdcheck.auth;

import org.apache.commons.codec.binary.Base64;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

public class PasswordHasher {
    private PasswordHasher() {
    }

    public static String hash(String password, String salt) {
        if(password == null || salt == null) {
            throw new NullPointerException();
        }

        String combined = password + salt;
        byte[] encoded = combined.getBytes(StandardCharsets.UTF_8);
        try {
            MessageDigest algo = MessageDigest.getInstance("SHA-256");
            byte[] hash = algo.digest(encoded);
            return Base64.encodeBase64String(hash);
        } catch (NoSuchAlgorithmException ex) {
            assert false;
            return null;
        }
    }

    public static String generateSalt() {
        Instant now = Instant.now();
        return Long.toString(now.toEpochMilli());
    }

    public static boolean isCorrectPassword(User user, String password) {
        if(user == null || password == null) {
            throw new NullPointerException();
        }
        String hashed = hash(password, user.getSalt());
        return hashed.equals(user.getPasswordHash());
    }
}
