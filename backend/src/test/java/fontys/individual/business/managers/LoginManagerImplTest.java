package fontys.individual.business.managers;

import fontys.individual.business.exceptions.InvalidPasswordException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.configuration.security.token.AccessTokenEncoder;
import fontys.individual.domain.requests.login.LoginRequest;
import fontys.individual.domain.responses.login.LoginResponse;
import fontys.individual.persistence.AdminRepository;
import fontys.individual.persistence.CustomerRepository;
import fontys.individual.persistence.entity.AdminEntity;
import fontys.individual.persistence.entity.CustomerEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class LoginManagerImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AccessTokenEncoder accessTokenEncoder;

    @InjectMocks
    private LoginManagerImpl loginManager;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_CustomerExists_ValidCredentials_ReturnsLoginResponse() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user4@example.com", "password");
        CustomerEntity customerEntity = new CustomerEntity(1L, "John Doe", "user1@example.com", "password", 25, "Address",  new Byte[]{1, 2, 3});
        when(customerRepository.existsByEmail(loginRequest.getEmail())).thenReturn(true);
        when(customerRepository.findByEmail(loginRequest.getEmail())).thenReturn(customerEntity);
        when(passwordEncoder.matches(loginRequest.getPassword(), customerEntity.getPassword())).thenReturn(true);
        when(accessTokenEncoder.encode(any())).thenReturn("encodedAccessToken");

        // Act
        LoginResponse loginResponse = loginManager.login(loginRequest);

        // Assert
        assertNotNull(loginResponse);
        assertEquals(1L, loginResponse.getId());
        assertEquals("encodedAccessToken", loginResponse.getAccessToken());
    }

    @Test
    void login_AdminExists_ValidCredentials_ReturnsLoginResponse() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user5@example.com", "password");
        AdminEntity adminEntity = new AdminEntity(1L, "Admin", "user5@example.com", "encodedPassword", null);
        when(adminRepository.existsByEmail(loginRequest.getEmail())).thenReturn(true);
        when(adminRepository.findByEmail(loginRequest.getEmail())).thenReturn(adminEntity);
        when(passwordEncoder.matches(loginRequest.getPassword(), adminEntity.getPassword())).thenReturn(true);
        when(accessTokenEncoder.encode(any())).thenReturn("encodedAccessToken");

        // Act
        LoginResponse loginResponse = loginManager.login(loginRequest);

        // Assert
        assertNotNull(loginResponse);
        assertEquals(1L, loginResponse.getId());
        assertEquals("encodedAccessToken", loginResponse.getAccessToken());
    }

    @Test
    void login_UserDoesNotExist_ThrowsNotFoundException() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user6@example.com", "password");
        when(customerRepository.existsByEmail(loginRequest.getEmail())).thenReturn(false);
        when(adminRepository.existsByEmail(loginRequest.getEmail())).thenReturn(false);

        // Act & Assert
        assertThrows(NotFoundException.class, () -> loginManager.login(loginRequest));
    }

    @Test
    void login_InvalidPassword_ThrowsInvalidPasswordException() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user4@example.com", "wrongPassword");
        CustomerEntity customerEntity = new CustomerEntity(1L, "John Doe", "user1@example.com", "password", 25, "Address",  new Byte[]{1, 2, 3});
        when(customerRepository.existsByEmail(loginRequest.getEmail())).thenReturn(true);
        when(customerRepository.findByEmail(loginRequest.getEmail())).thenReturn(customerEntity);
        when(passwordEncoder.matches(loginRequest.getPassword(), customerEntity.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidPasswordException.class, () -> loginManager.login(loginRequest));
    }
}