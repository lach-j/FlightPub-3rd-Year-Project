package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.annotation.JsonValue;
import seng3150.team4.flightpub.domain.models.IEntity;

import java.util.Collection;

public class EntityCollectionResponse<T extends Collection<? extends IEntity>> implements Response {

    @JsonValue
    T entity;

    public EntityCollectionResponse(T entity) {
        this.entity = entity;
    }
}
