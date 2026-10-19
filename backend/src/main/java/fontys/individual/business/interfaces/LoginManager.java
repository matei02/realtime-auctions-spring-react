package fontys.individual.business.interfaces;

import fontys.individual.domain.requests.login.LoginRequest;
import fontys.individual.domain.responses.login.LoginResponse;
import org.springframework.stereotype.Component;

@Component
public interface LoginManager {
    LoginResponse login(LoginRequest request);
}
