package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.repositories.IUserRepository;

import javax.persistence.EntityExistsException;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IUserRepository userRepository;

    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        var userExists = userRepository.existsById(user.getId());
        if (!userExists) throw new EntityExistsException(String.format("Entity with id %s already exists", user.getId()));

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}
