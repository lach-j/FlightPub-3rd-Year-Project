package seng3150.team4.flightpub.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "TicketClass")
@NoArgsConstructor
@Entity
@Getter
@Setter
public class TicketClass implements IEntity {

  @Id
  @Column(name = "ClassCode")
  private String classCode;

  @Column(name = "Details")
  private String details;
}
