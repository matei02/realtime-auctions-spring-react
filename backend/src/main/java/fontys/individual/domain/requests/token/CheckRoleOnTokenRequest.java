package fontys.individual.domain.requests.token;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckRoleOnTokenRequest {
    private String accessToken;
}
