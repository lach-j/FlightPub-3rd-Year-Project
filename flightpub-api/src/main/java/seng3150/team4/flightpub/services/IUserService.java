package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.User;

public interface IUserService {
  User registerUser(User user);

  User updateUser(User user);

  void deleteUser(User user);

  User getUserByEmail(String email);

  User getUserById(long userId);
}
