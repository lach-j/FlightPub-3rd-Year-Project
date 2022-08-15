import {HolidayPackage} from "./HolidayCardProps";
import {Passenger} from "./Passenger";

export interface HolidayPackageBooking {
    userId: any;
    holidayPackage: HolidayPackage;
    flightIds: number[];
    passengers: Passenger[];
}