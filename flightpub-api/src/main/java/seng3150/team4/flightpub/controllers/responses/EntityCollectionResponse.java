package seng3150.team4.flightpub.controllers.responses;

import com.fasterxml.jackson.annotation.JsonValue;
import seng3150.team4.flightpub.domain.models.IEntity;

import java.util.Collection;
/** Response for returning a Collection of IEntity objects */
public class EntityCollectionResponse<T extends IEntity> implements Response {

  @JsonValue Collection<T> entity; // @JsonValue to stop JSON from being nested

  public EntityCollectionResponse(Collection<T> entity) {
    this.entity = entity;
  }
}
