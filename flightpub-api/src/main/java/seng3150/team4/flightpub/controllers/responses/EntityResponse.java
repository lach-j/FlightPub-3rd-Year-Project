package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import seng3150.team4.flightpub.domain.models.IEntity;

public class EntityResponse<T extends IEntity> implements Response {

    @JsonUnwrapped
    T entity;

    public EntityResponse(T entity) {
        this.entity = entity;
    }
}
