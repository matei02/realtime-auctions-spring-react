package fontys.individual.domain.requests.customer;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCustomerRequest {
    private Long id;

    @NotBlank
    private String name;

    private String password;

    @Min(16)
    @Max(100)
    @NotNull
    private Integer age;

    @NotBlank
    private String address;

    private Byte[] image;
}
