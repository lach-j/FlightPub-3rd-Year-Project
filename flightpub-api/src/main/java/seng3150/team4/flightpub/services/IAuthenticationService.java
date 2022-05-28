package seng3150.team4.flightpub.services;

public interface IAuthenticationService {
  String loginUser(String email, String password);

  void sendResetEmail(String email);

  void resetPassword(String token, String password);
}
