package fontys.individual.domain.responses.painting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaintingResponse {
    private Long id;
    private String name;
    private String description;
    private double price;
}
