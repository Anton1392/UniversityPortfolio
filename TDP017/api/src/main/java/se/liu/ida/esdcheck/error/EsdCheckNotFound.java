package se.liu.ida.esdcheck.error;

public class EsdCheckNotFound extends EsdCheckException {
    public EsdCheckNotFound() {
    }

    public EsdCheckNotFound(String message) {
        super(message);
    }

    public EsdCheckNotFound(String message, Throwable cause) {
        super(message, cause);
    }
}
