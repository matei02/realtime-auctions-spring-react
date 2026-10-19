package fontys.individual.business.managers;

import fontys.individual.business.converters.CustomerConverter;
import fontys.individual.business.exceptions.EmailAlreadyUsedException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.CustomerManager;
import fontys.individual.domain.classes.Customer;
import fontys.individual.persistence.CustomerRepository;
import fontys.individual.persistence.entity.CustomerEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class CustomerManagerImpl implements CustomerManager {

    private final CustomerRepository customerRepository;
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Long createCustomer(Customer customer)
    {
        if (customerRepository.existsByEmail(customer.getEmail()))
        {
            throw new EmailAlreadyUsedException();
        }
        CustomerEntity entity = CustomerConverter.convertToCustomerEntity(customer);
        String pass = passwordEncoder.encode(entity.getPassword());
        entity.setPassword(pass);
        return customerRepository.save(entity).getId();
    }

    @Transactional
    public void deleteCustomer(long id)
    {
        customerRepository.deleteById(id);
    }

    @Transactional
    public Customer getCustomerById(long id)
    {
        Optional<CustomerEntity> customer = customerRepository.findById(id);
        if (customer.isPresent())
        {
            return CustomerConverter.convertToCustomer(customer.get());
        }
        else
        {
            throw new NotFoundException();
        }
    }

    @Transactional
    public List<Customer> getAllCustomers()
    {
        List<CustomerEntity> savedCustomers = customerRepository.findAll();
        return savedCustomers.stream()
                .map(CustomerConverter::convertToCustomer)
                .toList();
    }

    @Transactional
    public void updateCustomer(long id, Customer customer)
    {
        Optional<CustomerEntity> savedCustomer = customerRepository.findById(id);
        if (savedCustomer.isPresent())
        {
            CustomerEntity entity = savedCustomer.get();
            entity.setName(customer.getName());
            if (!customer.getPassword().isEmpty())
            {
                entity.setPassword(passwordEncoder.encode(customer.getPassword()));
            }
            entity.setAddress(customer.getAddress());
            entity.setAge(customer.getAge());
//            if (customer.getImage().length != 0)
//            {
                entity.setImage(customer.getImage());
//            }
            customerRepository.save(entity);
        }
        else {
            throw new NotFoundException();
        }
    }
}
