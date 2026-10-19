package fontys.individual.business.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class EmailAlreadyUsedException extends ResponseStatusException {
    public EmailAlreadyUsedException() {
        super(HttpStatus.CONFLICT);
    }
}
