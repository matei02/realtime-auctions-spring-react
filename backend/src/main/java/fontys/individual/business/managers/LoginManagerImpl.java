package fontys.individual.business.managers;

import fontys.individual.business.exceptions.InvalidPasswordException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.LoginManager;
import fontys.individual.configuration.security.token.AccessTokenEncoder;
import fontys.individual.configuration.security.token.impl.AccessTokenImpl;
import fontys.individual.domain.requests.login.LoginRequest;
import fontys.individual.domain.responses.login.LoginResponse;
import fontys.individual.persistence.AdminRepository;
import fontys.individual.persistence.CustomerRepository;
import fontys.individual.persistence.entity.AdminEntity;
import fontys.individual.persistence.entity.CustomerEntity;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class LoginManagerImpl implements LoginManager {
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccessTokenEncoder accessTokenEncoder;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        AdminEntity admin = null;
        CustomerEntity user = null;

        if (adminRepository.existsByEmail(loginRequest.getEmail())) {

            admin = adminRepository.findByEmail(loginRequest.getEmail());
        } else if (customerRepository.existsByEmail(loginRequest.getEmail())) {

            user = customerRepository.findByEmail(loginRequest.getEmail());
        }
        if (user == null && admin == null) {
            throw new NotFoundException();
        }

        String accessToken = "";

        if (admin == null) {
            if (!matchesPassword(loginRequest.getPassword(), user.getPassword())) {
                throw new InvalidPasswordException();
            }
            accessToken = generateAccessTokenCustomer(user);

        } else if (user == null) {
            if (!matchesPassword(loginRequest.getPassword(), admin.getPassword())) {
                throw new InvalidPasswordException();
            }
            accessToken = generateAccessTokenAdmin(admin);


        }

        if (admin != null) {
            return LoginResponse.builder().accessToken(accessToken).id(admin.getId()).build();
        }
        return LoginResponse.builder().accessToken(accessToken).id(user.getId()).build();
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private String generateAccessTokenAdmin(AdminEntity admin) {
        Long id = admin.getId();
//        List<String> roles = admin.getUserRoles().stream()
//                .map(userRole -> userRole.ad.toString())
//                .toList();
        List<String> roles = new ArrayList<>();
        roles.add("ADMIN");

        return accessTokenEncoder.encode(
                new AccessTokenImpl(admin.getEmail(), id, roles));
    }

    private String generateAccessTokenCustomer(CustomerEntity user) {
        Long id = user.getId();
//        List<String> roles = user.getUserRoles().stream()
//                .map(userRole -> userRole.getRole().toString())
//                .toList();
        List<String> roles = new ArrayList<>();
        roles.add("CUSTOMER");

        return accessTokenEncoder.encode(
                new AccessTokenImpl(user.getEmail(), id, roles));
    }

}
