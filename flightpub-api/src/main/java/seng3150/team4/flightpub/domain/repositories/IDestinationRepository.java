import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Destination;

public interface IDestinationRepository extends CrudRepository<Destination, String> {
}
