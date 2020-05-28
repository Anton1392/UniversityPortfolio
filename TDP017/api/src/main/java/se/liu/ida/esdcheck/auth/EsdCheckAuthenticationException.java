package se.liu.ida.esdcheck.auth;

import se.liu.ida.esdcheck.error.EsdCheckException;

public class EsdCheckAuthenticationException extends EsdCheckException {
    public EsdCheckAuthenticationException() {
    }

    public EsdCheckAuthenticationException(String message) {
        super(message);
    }

    public EsdCheckAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }

    public EsdCheckAuthenticationException(Throwable cause) {
        super(cause);
    }
}
