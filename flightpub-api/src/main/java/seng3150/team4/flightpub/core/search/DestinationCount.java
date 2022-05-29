package seng3150.team4.flightpub.core.search;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seng3150.team4.flightpub.domain.models.IEntity;

/** Data object to hold number of flights from or to a destination. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DestinationCount implements IEntity {
  private String destinationCode;
  private long count;
}
