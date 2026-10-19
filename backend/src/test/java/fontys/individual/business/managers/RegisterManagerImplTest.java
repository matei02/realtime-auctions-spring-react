package fontys.individual.business.managers;

import fontys.individual.business.interfaces.CustomerManager;
import fontys.individual.configuration.security.token.AccessTokenEncoder;
import fontys.individual.domain.classes.Customer;
import fontys.individual.domain.requests.register.RegisterRequest;
import fontys.individual.domain.responses.register.RegisterResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegisterManagerImplTest {

    @InjectMocks
    private RegisterManagerImpl registerManager;

    @Mock
    private CustomerManager customerManager;

    @Mock
    private AccessTokenEncoder accessTokenEncoder;

    private RegisterRequest registerRequest;
    private Customer testCustomer;

    @BeforeEach
    public void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test");
        registerRequest.setEmail("user7@example.com");
        registerRequest.setPassword("password");
        registerRequest.setAge(30);
        registerRequest.setAddress("Test Address");

        testCustomer = new Customer(0L, "Test", "user7@example.com", "password", 30, "Test Address", null);
        //CustomerEntity testEntity = CustomerConverter.convertToCustomerEntity(testCustomer);
    }

    @Test
    public void testRegister() {
        when(customerManager.createCustomer(any(Customer.class))).thenReturn(1L);
        when(customerManager.getCustomerById(anyLong())).thenReturn(testCustomer);
        when(accessTokenEncoder.encode(any())).thenReturn("token");

        RegisterResponse response = registerManager.register(registerRequest);

        assertEquals("token", response.getAccessToken());
    }
}