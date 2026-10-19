package fontys.individual.domain.responses.customer;

import fontys.individual.domain.classes.Customer;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetCustomerResponse {
    private Customer customer;
}
