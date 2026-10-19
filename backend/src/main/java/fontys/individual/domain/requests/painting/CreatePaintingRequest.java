package fontys.individual.domain.requests.painting;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class CreatePaintingRequest {

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
}
