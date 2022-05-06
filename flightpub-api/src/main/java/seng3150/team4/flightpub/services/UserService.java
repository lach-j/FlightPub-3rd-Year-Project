package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.core.email.RegisterEmailTemplate;
import seng3150.team4.flightpub.domain.models.User;
import seng3150.team4.flightpub.domain.repositories.IUserRepository;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IUserRepository userRepository;
    private final IEmailSenderService emailSenderService;

    @Override
    public User registerUser(User user) {
        User savedUser = userRepository.save(user);
        var registerTemplate = new RegisterEmailTemplate();

        registerTemplate.setFirstName(savedUser.getFirstName());

        emailSenderService.sendTemplateEmail(
                new Email(savedUser.getEmail()),
                registerTemplate
        );
        return savedUser;
    }

    @Override
    public User updateUser(User user) {
        var userExists = userRepository.existsById(user.getId());
        if (!userExists) throw new EntityExistsException(String.format("User with id %s already exists", user.getId()));

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Override
    public User getUserByEmail(String email) {
        var user = userRepository.findByEmail(email);
        if (user.isEmpty()) throw new EntityNotFoundException(String.format("User with email %s was not found", email));

        return user.get();
    }

    @Override
    public User getUserById(long userId) {
        var user = userRepository.findById(userId);
        if (user.isEmpty()) throw new EntityNotFoundException(String.format("User with id %s was not found", userId));

        return user.get();
    }
}
