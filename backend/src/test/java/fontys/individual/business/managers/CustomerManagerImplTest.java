package fontys.individual.business.managers;

import fontys.individual.business.exceptions.EmailAlreadyUsedException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.domain.classes.Customer;
import fontys.individual.persistence.CustomerRepository;
import fontys.individual.persistence.entity.CustomerEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

//@ExtendWith(MockitoExtension.class)
//public class CustomerManagerImplTest {
//
//    @Mock
//    private CustomerRepository customerRepository;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//    @InjectMocks
//    private CustomerManagerImpl customerManager;// = new CustomerManagerImpl(customerRepository, passwordEncoder);
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testCreateCustomer() {
//        Customer customer = new Customer(1L, "John Doe", "user3@example.com", "password", 30, "Address", null);
//        CustomerEntity customerEntity = CustomerConverter.convertToCustomerEntity(customer);
//
//        // Assuming your CustomerEntity class uses GenerationType.IDENTITY for ID generation
//        when(customerRepository.save(any(CustomerEntity.class))).thenReturn(customerEntity);
//
//        Long id = customerManager.createCustomer(customer);
//
//        // Assuming your CustomerEntity class uses GenerationType.IDENTITY for ID generation
//        assertEquals(customerEntity.getId(), id);
//    }
//
////    @Test
////    public void testCreateCustomer() {
////        Customer customer = new Customer(1L, "John Doe", "user3@example.com", "password", 30, "Address", null);
////        CustomerEntity customerEntity = CustomerConverter.convertToCustomerEntity(customer);
////        when(customerRepository.save(any(CustomerEntity.class))).thenReturn(customerEntity);
////
////        Long id = customerManager.createCustomer(customer);
////
////        assertEquals(customerEntity.getId(), id);
////    }
//
//    @Test
//    public void testDeleteCustomer() {
//        long id = 1L;
//        customerManager.deleteCustomer(id);
//        verify(customerRepository, times(1)).deleteById(id);
//    }
//
//    @Test
//    public void testGetCustomerById() {
//        long id = 1L;
//        CustomerEntity customerEntity = new CustomerEntity(1L, "John Doe", "user3@example.com", "password", 30, "Address", null);
//        when(customerRepository.findById(id)).thenReturn(Optional.of(customerEntity));
//
//        Customer customer = customerManager.getCustomerById(id);
//
//        assertEquals(customerEntity.getId(), customer.getId());
//    }
//
//    @Test
//    public void testGetAllCustomers() {
//        List<CustomerEntity> customerEntities = Collections.singletonList(new CustomerEntity(1L, "John Doe", "user3@example.com", "password", 30, "Address", null));
//        when(customerRepository.findAll()).thenReturn(customerEntities);
//
//        List<Customer> expectedCustomers = Collections.singletonList(new Customer(1L, "John Doe", "user3@example.com", "password", 30, "Address", null));
//        List<Customer> actualCustomers = customerManager.getAllCustomers();
//
//        assertEquals(expectedCustomers.size(), actualCustomers.size());
//    }
//
//    @Test
//    public void testUpdateCustomer() {
//        long id = 1L;
//        Customer customer = new Customer(1L, "John Doe", "user3@example.com", "password", 30, "Address", null);
//        CustomerEntity customerEntity = CustomerConverter.convertToCustomerEntity(customer);
//        when(customerRepository.findById(id)).thenReturn(Optional.of(customerEntity));
//
//        customerManager.updateCustomer(id, customer);
//
//        verify(customerRepository, times(1)).save(customerEntity);
//    }
//}

@ExtendWith(MockitoExtension.class)
class CustomerManagerImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerManagerImpl customerManager;

    private static final Long CUSTOMER_ID = 1L;

    private CustomerEntity createMockCustomerEntity() {
        return new CustomerEntity(CUSTOMER_ID, "John Doe", "user1@example.com", "password", 25, "Address",  new Byte[]{1, 2, 3});
    }

    private Customer createMockCustomer() {
        return new Customer(CUSTOMER_ID, "John Doe", "user1@example.com", "password", 25, "Address",  new Byte[]{1, 2, 3});
    }

    @BeforeEach
    void setUp() {
        // Use lenient strictness to suppress unnecessary stubbing warning
        lenient().when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
    }


    @Test
    void createCustomer_HappyFlow() {
        Customer customer = createMockCustomer();

        when(customerRepository.existsByEmail(customer.getEmail())).thenReturn(false);
        when(customerRepository.save(any(CustomerEntity.class))).thenReturn(createMockCustomerEntity());

        Long customerId = customerManager.createCustomer(customer);

        assertNotNull(customerId);
        verify(customerRepository, times(1)).save(any(CustomerEntity.class));
    }

    @Test
    void createCustomer_EmailAlreadyUsed_ThrowsException() {
        Customer customer = createMockCustomer();

        when(customerRepository.existsByEmail(customer.getEmail())).thenReturn(true);

        assertThrows(EmailAlreadyUsedException.class, () -> {
            customerManager.createCustomer(customer);
        });

        verify(customerRepository, never()).save(any(CustomerEntity.class));
    }

    @Test
    void deleteCustomer_HappyFlow() {
        doNothing().when(customerRepository).deleteById(CUSTOMER_ID);

        assertDoesNotThrow(() -> {
            customerManager.deleteCustomer(CUSTOMER_ID);
        });

        verify(customerRepository, times(1)).deleteById(CUSTOMER_ID);
    }

    @Test
    void getCustomerById_CustomerExists_ReturnsCustomer() {
        CustomerEntity customerEntity = createMockCustomerEntity();
        Customer expectedCustomer = createMockCustomer();

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(customerEntity));

        Customer actualCustomer = customerManager.getCustomerById(CUSTOMER_ID);

        assertEquals(expectedCustomer, actualCustomer);
    }

    @Test
    void getCustomerById_CustomerDoesNotExist_ThrowsException() {
        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            customerManager.getCustomerById(CUSTOMER_ID);
        });
    }

    @Test
    void getAllCustomers_HappyFlow() {
        List<CustomerEntity> savedCustomers = Arrays.asList(
                createMockCustomerEntity(),
                createMockCustomerEntity()
        );

        when(customerRepository.findAll()).thenReturn(savedCustomers);

        List<Customer> actualCustomers = customerManager.getAllCustomers();

        assertEquals(savedCustomers.size(), actualCustomers.size());
    }

    @Test
    void updateCustomer_CustomerExists_UpdatesCustomer() {
        CustomerEntity savedCustomer = createMockCustomerEntity();
        Customer updatedCustomer = createMockCustomer();
        updatedCustomer.setName("Updated Name");

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(savedCustomer));
        when(customerRepository.save(any(CustomerEntity.class))).thenReturn(savedCustomer);

        assertDoesNotThrow(() -> {
            customerManager.updateCustomer(CUSTOMER_ID, updatedCustomer);
        });

        verify(customerRepository, times(1)).save(any(CustomerEntity.class));
    }

    @Test
    void updateCustomer_CustomerDoesNotExist_ThrowsException() {
        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            customerManager.updateCustomer(CUSTOMER_ID, createMockCustomer());
        });

        verify(customerRepository, never()).save(any(CustomerEntity.class));
    }
}