package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.CreateHolidayPackageRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.HolidayPackage;
import seng3150.team4.flightpub.domain.repositories.IDestinationRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageRepository;
import seng3150.team4.flightpub.services.IHolidayPackageService;

import java.util.ArrayList;

@RestController
@RequiredArgsConstructor
@RequestMapping("/holidayPackages")
public class HolidayPackageController {

  private final IHolidayPackageService holidayPackageService;
  private final IHolidayPackageRepository holidayPackageRepository;
  private final IDestinationRepository destinationRepository;

  @GetMapping("/getAll")
  public Response getAll() {
    var holidayPackages = new ArrayList<HolidayPackage>() {};
    holidayPackages.addAll(holidayPackageRepository.findAll());
    return new EntityCollectionResponse<>(holidayPackages);
  }

  @GetMapping("/getByDeparture/{destination}")
  public Response getByDeparture(@PathVariable String destination) {

    var recommended = holidayPackageService.getRecommendedPackages(destination);
    return new EntityCollectionResponse<>(recommended);
  }

  @GetMapping("/{holidayPackageId}")
  public EntityResponse<HolidayPackage> getHolidayPackageById(@PathVariable long holidayPackageId) {
    var holidayPackage = holidayPackageService.getHolidayPackageById(holidayPackageId);
    return new EntityResponse<>(holidayPackage);
  }

  @PostMapping("/holiday-packages")
  public ResponseEntity<? extends Response> makeBooking(
      @RequestBody CreateHolidayPackageRequest holidayPackageRequest) {
    holidayPackageRequest.validate();
    var holidayPackage = holidayPackageFromRequest(holidayPackageRequest);
    var savedHolidayPackage =
        holidayPackageService.makePackage(holidayPackage, holidayPackageRequest.getFlightIds());
    return ResponseEntity.ok().body(new EntityResponse<>(savedHolidayPackage));
  }

  private static HolidayPackage holidayPackageFromRequest(CreateHolidayPackageRequest request) {
    HolidayPackage holidayPackage = new HolidayPackage();

    holidayPackage.setIsPopular(request.getIsPopular());
    holidayPackage.setImageURL(request.getImageURL());
    holidayPackage.setPackageName(request.getPackageName());
    holidayPackage.setPackageDescription(request.getPackageDescription());
    holidayPackage.setPackageTagline(request.getPackageTagline());
    holidayPackage.setPackageNights(request.getPackageNights());
    holidayPackage.setLocation(request.getLocation());
    holidayPackage.setPrice(request.getPrice());
    holidayPackage.setArrivalLocation(request.getArrivalLocation());
    holidayPackage.setAccommodation(request.getAccommodation());

    return holidayPackage;
  }
}
