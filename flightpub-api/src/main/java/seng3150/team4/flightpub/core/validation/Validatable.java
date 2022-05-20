package seng3150.team4.flightpub.core.validation;

public abstract class Validatable {
    protected abstract ValidationResult getErrors();

    public void validate() throws InvalidObjectException {
        var err = getErrors();

        if (err.getErrors().values().stream().allMatch(e -> err.getErrors().isEmpty())) {
            return;
        }

        throw new InvalidObjectException(err);
    }
}
