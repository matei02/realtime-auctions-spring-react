package fontys.individual.domain.responses.admin;

import fontys.individual.domain.classes.Admin;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetAdminResponse {
    private Admin admin;
}
