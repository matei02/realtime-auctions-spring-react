package fontys.individual.domain.responses.token;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckRoleOnTokenResponse {
    private String role;
}
