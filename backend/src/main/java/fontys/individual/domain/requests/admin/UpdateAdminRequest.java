package fontys.individual.domain.requests.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateAdminRequest {
    /*private Long id;*/

    @NotBlank
    private String name;

    /*@NotBlank
    @Email
    private String email;*/

    //@NotBlank
    private String password;

    private Byte[] image;
}
