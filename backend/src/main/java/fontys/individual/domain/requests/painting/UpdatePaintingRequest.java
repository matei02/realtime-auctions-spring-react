package fontys.individual.domain.requests.painting;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdatePaintingRequest {

    @NotBlank
    private String name;

    @NotNull
    private Double price;

    @NotBlank
    private String description;

    @NotNull
    private Integer length;

    @NotNull
    private Integer width;

    @NotNull
    private Byte[] image;

    @NotNull
    private Integer auction;

    @NotNull
    private Integer sold;
}
