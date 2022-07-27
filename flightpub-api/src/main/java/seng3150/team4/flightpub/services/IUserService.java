package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.User;

import java.util.Collection;
import java.util.List;
import java.util.Set;

/** Interface to define UserService methods */
public interface IUserService {
  User registerUser(User user);

  User updateUser(User user);

  void deleteUser(User user);

  User getUserByEmail(String email);

  User getUserById(long userId);
  List<User> getUsersById(Collection<Long> userId);
}
