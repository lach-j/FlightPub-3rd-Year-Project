package seng3150.team4.flightpub.core.search;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class FlexiDate {
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate date;

  // number of days each side of the date to be flexible by
  private int flex;

  // Gets the minimum date to be flexible by
  public LocalDateTime getMinDateTime() {
    return date.minusDays(flex).atStartOfDay();
  }

  // Gets the maximum date to be flexible by
  public LocalDateTime getMaxDateTime() {
    return date.plusDays(flex).atTime(23, 59, 59);
  }
}
