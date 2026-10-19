package fontys.individual.business.converters;

import fontys.individual.domain.classes.Customer;
import fontys.individual.persistence.entity.CustomerEntity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class CustomerConverter {

    public static Customer convertToCustomer(CustomerEntity customer) {
        return Customer.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .password(customer.getPassword())
                .age(customer.getAge())
                .address(customer.getAddress())
                .image(customer.getImage())
                .build();
    }

    public static CustomerEntity convertToCustomerEntity(Customer customer) {
        return CustomerEntity.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .password(customer.getPassword())
                .age(customer.getAge())
                .address(customer.getAddress())
                .image(customer.getImage())
                .build();
    }
}
