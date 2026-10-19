package fontys.individual.business.interfaces;

import fontys.individual.domain.classes.Customer;

import java.util.List;

public interface CustomerManager {
    Long createCustomer(Customer customer);

    void deleteCustomer(long id);

    Customer getCustomerById(long id);

    List<Customer> getAllCustomers();

    void updateCustomer(long id, Customer customer);

}
