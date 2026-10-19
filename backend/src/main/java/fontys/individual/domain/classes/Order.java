package fontys.individual.domain.classes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;

    private double price;

    private String name;

    private String description;

    private int length;

    private int width;

    private Byte[] image;

    private BigInteger buyer_id;

    private String buyer_email;

    private String buyer_address;

    private int status;
}
