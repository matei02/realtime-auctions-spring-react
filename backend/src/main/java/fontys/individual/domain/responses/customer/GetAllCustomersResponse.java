package fontys.individual.domain.responses.customer;

import fontys.individual.domain.classes.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllCustomersResponse {
    private List<Customer> customers;
}
