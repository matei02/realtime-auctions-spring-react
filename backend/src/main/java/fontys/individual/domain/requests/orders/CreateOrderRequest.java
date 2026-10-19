package fontys.individual.domain.requests.orders;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigInteger;

@Data
@Builder
public class CreateOrderRequest {
    @NotNull
    private int paintingID;

    @NotNull
    private double price;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private int length;

    @NotNull
    private int width;

    @NotNull
    private Byte[] image;

    @NotNull
    private BigInteger buyer_id;

    @NotBlank
    private String buyer_email;

    @NotBlank
    private String buyer_address;

    @NotNull
    private int status;
}
