package se.liu.ida.esdcheck.error;

public class EsdCheckErrorMessage {
    private String message;

    public EsdCheckErrorMessage() {
    }

    public EsdCheckErrorMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
