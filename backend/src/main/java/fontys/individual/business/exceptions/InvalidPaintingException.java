package fontys.individual.business.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidPaintingException extends ResponseStatusException {

    public InvalidPaintingException() {
        super(HttpStatus.CONFLICT);
    }
}
