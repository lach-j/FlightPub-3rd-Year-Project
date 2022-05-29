package seng3150.team4.flightpub.utility;

import java.util.Calendar;
import java.util.Date;

/** Utility class for time transformation methods */
public class TimeFunctions {
  public static Date minutesFromNow(long minutes) {
    // Get the current date as a Calendar
    Calendar date = Calendar.getInstance();

    // Convert to millis and then create a new date with the number of minutes added
    long timeInMillis = date.getTimeInMillis();
    return new Date(timeInMillis + (minutes * 60 * 1000));
  }
}
