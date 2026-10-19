package fontys.individual.domain.responses.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateAdminResponse {
    private Long id;
    private String name;
}
