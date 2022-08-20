package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.SavedPayment;
import seng3150.team4.flightpub.domain.models.User;

import java.util.Collection;
import java.util.List;

/** Interface to define UserService methods */
public interface IUserService {
  User registerUser(User user);

  User updateUser(User user);

  void deleteUser(User user);

  User getUserByEmail(String email);

  User getUserByEmailSecure(String email);

  User getUserById(long userId);

  User getUserByIdSecure(long userId);

  List<User> getUsersById(Collection<Long> userId);

  SavedPayment addNewPayment(long userId, SavedPayment payment);

  SavedPayment updatePayment(long userId, long paymentId, SavedPayment payment);

  void deletePayment(long userId, long paymentId);
}
