package seng3150.team4.flightpub.utility;

import java.util.Calendar;
import java.util.Date;

public class TimeFunctions {
  public static Date minutesFromNow(long minutes) {
    Calendar date = Calendar.getInstance();
    long timeInSecs = date.getTimeInMillis();
    return new Date(timeInSecs + (minutes * 60 * 1000));
  }
}
