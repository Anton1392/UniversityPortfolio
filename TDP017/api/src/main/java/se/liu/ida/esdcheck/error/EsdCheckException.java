package se.liu.ida.esdcheck.error;

public class EsdCheckException extends RuntimeException {
    public EsdCheckException() {
    }

    public EsdCheckException(String message) {
        super(message);
    }

    public EsdCheckException(String message, Throwable cause) {
        super(message, cause);
    }

    public EsdCheckException(Throwable cause) {
        super(cause);
    }
}
