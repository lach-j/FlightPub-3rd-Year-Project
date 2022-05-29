package seng3150.team4.flightpub.services;

public interface IAuthenticationService {

  // Generates a JWT if the login is valid
  String loginUser(String email, String password);

  // Sends a reset password email to the user if they are registered
  void sendResetEmail(String email);

  // Resets the users password using the provided token
  void resetPassword(String token, String password);
}
