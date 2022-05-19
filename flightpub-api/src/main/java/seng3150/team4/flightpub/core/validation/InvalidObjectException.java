package seng3150.team4.flightpub.core.validation;

public class InvalidObjectException extends RuntimeException {
    private final ValidationResult result;

    public InvalidObjectException(ValidationResult result) {
        super("The object failed validation");
        this.result = result;
    }

    public ValidationResult getResult() {
        return result;
    }
}
