package seng3150.team4.flightpub;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import seng3150.team4.flightpub.core.search.FlexiDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FlexiDateTests {

  @Test
  void minDateIsCorrect() {
    // Arrange
    var date = new FlexiDate();
    date.setDate(LocalDate.of(2022, 5, 20));
    date.setFlex(3);

    // Act
    var minDateTime = date.getMinDateTime();

    // Assert
    Assertions.assertEquals(minDateTime, LocalDateTime.of(2022, 5, 17, 0, 0, 0));
  }

  @Test
  void maxDateIsCorrect() {
    // Arrange
    var date = new FlexiDate();
    date.setDate(LocalDate.of(2022, 5, 20));
    date.setFlex(3);

    // Act
    var maxDateTime = date.getMaxDateTime();

    // Assert
    Assertions.assertEquals(maxDateTime, LocalDateTime.of(2022, 5, 23, 23, 59, 59));
  }
}
