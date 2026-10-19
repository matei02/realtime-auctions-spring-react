package fontys.individual.domain.responses.painting;

import fontys.individual.domain.classes.Painting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllPaintingsResponse {
    private List<Painting> paintings;
}
