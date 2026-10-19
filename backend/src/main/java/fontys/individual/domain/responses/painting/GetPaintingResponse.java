package fontys.individual.domain.responses.painting;

import fontys.individual.domain.classes.Painting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetPaintingResponse {
    private Painting painting;
}
