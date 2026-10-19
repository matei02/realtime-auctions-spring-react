//package fontys.individual.persistence.impl;
//
//import fontys.individual.domain.classes.Customer;
//import fontys.individual.persistence.CustomerRepository;
//import fontys.individual.persistence.entity.CustomerEntity;
//import org.springframework.stereotype.Repository;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//@Repository
//public class FakeCustomerRepositoryImpl implements CustomerRepository {
//
//    private static long NEXT_ID = 1;
//
//    private final List<CustomerEntity> savedCustomers;
//
//    public FakeCustomerRepositoryImpl(){this.savedCustomers = new ArrayList<>();}
//
//    @Override
//    public boolean existsById(long id) {
//        return this.savedCustomers
//                .stream()
//                .anyMatch(CustomerEntity -> CustomerEntity.getId() == id);
//    }
//
//    @Override
//    public boolean existsByEmail(String email)
//    {
//        for (CustomerEntity c:
//             savedCustomers) {
//            if (c.getEmail()!=null)
//            {
//                if (email.equals(c.getEmail()))
//                    return true;
//            }
//        }
//        return false;
//    }
//
//    @Override
//    public CustomerEntity save(CustomerEntity customer) {
//        if (customer.getId() == null)
//        {
//            customer.setId(NEXT_ID);
//            NEXT_ID++;
//        }
//        this.savedCustomers.add(customer);
//        return customer;
//    }
//
//    @Override
//    public List<CustomerEntity> findAll() {
//        return Collections.unmodifiableList(savedCustomers);
//    }
//
//    @Override
//    public CustomerEntity findById(long id) {
//        return this.savedCustomers
//                .stream()
//                .filter(CustomerEntity -> CustomerEntity.getId() == id)
//                .findFirst()
//                .orElse(null);
//    }
//
//    @Override
//    public int count() {
//        return savedCustomers.size();
//    }
//
//    @Override
//    public void deleteCustomerById(long id) {
//        savedCustomers.remove(findById(id));
//    }
//
//    @Override
//    public void updateCustomer(long id, Customer customer) {
//        if (findById(id) != null)
//        {
//            CustomerEntity customerEntity = findById(id);
//            customerEntity.setName(customer.getName());
//            customerEntity.setPassword(customer.getPassword());
//            customerEntity.setAge(customer.getAge());
//            //savedCustomers.set((int)id, customerEntity);
//        }
//    }
//}
