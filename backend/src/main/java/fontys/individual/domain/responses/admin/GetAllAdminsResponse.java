package fontys.individual.domain.responses.admin;

import fontys.individual.domain.classes.Admin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllAdminsResponse {
    private List<Admin> allAdmins;
}
