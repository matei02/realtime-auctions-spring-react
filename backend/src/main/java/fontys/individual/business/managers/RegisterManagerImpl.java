package fontys.individual.business.managers;

import fontys.individual.business.converters.CustomerConverter;
import fontys.individual.business.interfaces.CustomerManager;
import fontys.individual.business.interfaces.RegisterManager;
import fontys.individual.configuration.security.token.AccessTokenEncoder;
import fontys.individual.configuration.security.token.impl.AccessTokenImpl;
import fontys.individual.domain.classes.Customer;
import fontys.individual.domain.requests.register.RegisterRequest;
import fontys.individual.domain.responses.register.RegisterResponse;
import fontys.individual.persistence.entity.CustomerEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RegisterManagerImpl implements RegisterManager {

    private final CustomerManager customerManager;
    private final AccessTokenEncoder accessTokenEncoder;
    @Override
    public RegisterResponse register(RegisterRequest request) {
        Customer customer = new Customer(0L, request.getName(), request.getEmail(), request.getPassword(), request.getAge(), request.getAddress(), null);
        Long id = customerManager.createCustomer(customer);
        CustomerEntity entity = CustomerConverter.convertToCustomerEntity(customerManager.getCustomerById(id));
        return RegisterResponse.builder().accessToken(generateAccessTokenCustomer(entity)).id(id).build();
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
