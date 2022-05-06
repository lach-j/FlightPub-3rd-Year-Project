package seng3150.team4.flightpub.core.email;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public abstract class EmailTemplate {
    protected final String templateId;
    protected final String fromName;

    public abstract Map<String, Object> getMappedValues();

    EmailTemplate(String templateId, String fromName) {
        this.templateId = templateId;
        this.fromName = fromName;
    }
}
