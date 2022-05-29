package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import seng3150.team4.flightpub.domain.models.IEntity;

/**
 * Response for returning a single entity as a response
 *
 * @param <T>
 */
public class EntityResponse<T extends IEntity> implements Response {

  @JsonUnwrapped T entity; // Unwraps the object so that the JSON is not nested.

  public EntityResponse(T entity) {
    this.entity = entity;
  }
}
