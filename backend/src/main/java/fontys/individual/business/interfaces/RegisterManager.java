package fontys.individual.business.interfaces;

import fontys.individual.domain.requests.register.RegisterRequest;
import fontys.individual.domain.responses.register.RegisterResponse;
import org.springframework.stereotype.Component;

@Component
public interface RegisterManager {
    RegisterResponse register(RegisterRequest request);
}
