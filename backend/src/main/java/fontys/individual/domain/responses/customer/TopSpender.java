package fontys.individual.domain.responses.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSpender {
    private long id;
    private String name;
    private String email;
    private int age;
    private String address;
    private Byte[] image;
    private double totalAmountSpent;
}
