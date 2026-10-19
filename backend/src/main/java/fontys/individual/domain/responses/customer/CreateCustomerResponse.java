package fontys.individual.domain.responses.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateCustomerResponse {
    private Long id;
    private String name;
    private String email;
    private int age;
    private String address;
}
