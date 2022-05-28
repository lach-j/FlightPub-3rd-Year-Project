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

  private int flex;

  public LocalDateTime getMinDateTime() {
    return date.minusDays(flex).atStartOfDay();
  }

  public LocalDateTime getMaxDateTime() {
    return date.plusDays(flex).atTime(23, 59, 59);
  }
}
